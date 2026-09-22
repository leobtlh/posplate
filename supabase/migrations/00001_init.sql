-- =============================================================================
-- Posplate — Schéma Supabase (Migration initiale)
-- =============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. PROFILES
-- =============================================================================
CREATE TABLE profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username  TEXT UNIQUE,
  avatar_url TEXT,
  bio       TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les profils sont publics en lecture"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Chacun peut modifier son propre profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- 2. RECIPES
-- =============================================================================
CREATE TABLE recipes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  media_url   TEXT,
  thumbnail_url TEXT,
  cuisine     TEXT,
  difficulty  TEXT CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
  prep_time   INT,  -- minutes
  cook_time   INT,  -- minutes
  calories    INT,
  portions    INT DEFAULT 1,
  price_chf   DECIMAL(6,2),
  mines       INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les recettes sont publiques en lecture"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "Chacun peut créer une recette"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Le créateur peut modifier sa recette"
  ON recipes FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Le créateur peut supprimer sa recette"
  ON recipes FOR DELETE
  USING (auth.uid() = creator_id);

-- =============================================================================
-- 3. INGREDIENTS (référentiel)
-- =============================================================================
CREATE TABLE ingredients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  category    TEXT,  -- e.g. 'légumes', 'viandes', 'féculents', 'épices'
  emoji       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ingrédients publics"
  ON ingredients FOR SELECT
  USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les ingrédients"
  ON ingredients FOR INSERT
  WITH CHECK (false);

-- =============================================================================
-- 4. RECIPE_INGREDIENTS (liaison)
-- =============================================================================
CREATE TABLE recipe_ingredients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id       UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id   UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity        TEXT,       -- e.g. '200g', '2', '1 cs'
  optional        BOOLEAN DEFAULT false,
  sort_order      INT DEFAULT 0,
  UNIQUE (recipe_id, ingredient_id)
);

ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique"
  ON recipe_ingredients FOR SELECT
  USING (true);

CREATE POLICY "Le créateur de la recette peut gérer les ingrédients"
  ON recipe_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND creator_id = auth.uid())
  );

-- =============================================================================
-- 5. RECIPE_STEPS
-- =============================================================================
CREATE TABLE recipe_steps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL,
  duration_sec INT,  -- optionnel : timer
  sort_order  INT DEFAULT 0
);

ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique"
  ON recipe_steps FOR SELECT
  USING (true);

CREATE POLICY "Le créateur peut gérer les étapes"
  ON recipe_steps FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND creator_id = auth.uid())
  );

-- =============================================================================
-- 6. PRICES (Coop / Migros)
-- =============================================================================
CREATE TABLE prices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id   UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  store           TEXT NOT NULL CHECK (store IN ('coop', 'migros')),
  price_chf       DECIMAL(6,2) NOT NULL,
  unit            TEXT,         -- e.g. 'kg', 'pièce', 'litre'
  quantity        TEXT,         -- e.g. '1kg', '200g'
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (ingredient_id, store)
);

ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prix publics"
  ON prices FOR SELECT
  USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les prix"
  ON prices FOR INSERT
  WITH CHECK (false);

-- =============================================================================
-- 7. MINES (j'aime)
-- =============================================================================
CREATE TABLE mines (
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id   UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE mines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chacun voit les mines"
  ON mines FOR SELECT
  USING (true);

CREATE POLICY "L'utilisateur peut miner"
  ON mines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "L'utilisateur peut déminer"
  ON mines FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger : compter les mines
CREATE OR REPLACE FUNCTION update_mines_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.recipes SET mines = mines + 1 WHERE id = NEW.recipe_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.recipes SET mines = GREATEST(mines - 1, 0) WHERE id = OLD.recipe_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE OR REPLACE TRIGGER on_mine_insert
  AFTER INSERT ON mines
  FOR EACH ROW EXECUTE FUNCTION update_mines_count();

CREATE OR REPLACE TRIGGER on_mine_delete
  AFTER DELETE ON mines
  FOR EACH ROW EXECUTE FUNCTION update_mines_count();

-- =============================================================================
-- 8. SAVED_RECIPES (favoris)
-- =============================================================================
CREATE TABLE saved_recipes (
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id   UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "L'utilisateur voit ses favoris"
  ON saved_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "L'utilisateur peut sauvegarder"
  ON saved_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "L'utilisateur peut retirer"
  ON saved_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- 9. HOUSEHOLDS (foyers)
-- =============================================================================
CREATE TABLE households (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- 10. HOUSEHOLD_MEMBERS
-- =============================================================================
CREATE TABLE household_members (
  household_id  UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at     TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (household_id, user_id)
);

ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les membres voient le foyer"
  ON households FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Créer un foyer"
  ON households FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Les membres voient les membres"
  ON household_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members hm
      WHERE hm.household_id = household_id AND hm.user_id = auth.uid()
    )
  );

CREATE POLICY "Ajouter un membre"
  ON household_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_id = household_id AND user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- 11. MEAL_PLANS (Make it mine → planning hebdo)
-- =============================================================================
CREATE TABLE meal_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id     UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  household_id  UUID REFERENCES households(id) ON DELETE CASCADE,
  plan_date     DATE NOT NULL,
  meal_type     TEXT NOT NULL CHECK (meal_type IN ('lunch', 'dinner', 'snack')),
  servings      INT DEFAULT 1,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, household_id, plan_date, meal_type, recipe_id)
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "L'utilisateur voit ses plannings"
  ON meal_plans FOR SELECT
  USING (auth.uid() = user_id OR household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "L'utilisateur peut planifier"
  ON meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "L'utilisateur peut supprimer"
  ON meal_plans FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- 12. FEEDBACK_LOG (traçabilité Gorse)
-- =============================================================================
CREATE TABLE feedback_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  recipe_id   UUID NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('view', 'mine', 'save', 'unmine')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE feedback_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "L'utilisateur voit son historique"
  ON feedback_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Insertion depuis l'API"
  ON feedback_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX idx_recipes_creator   ON recipes(creator_id);
CREATE INDEX idx_recipes_mines     ON recipes(mines DESC);
CREATE INDEX idx_recipes_cuisine   ON recipes(cuisine);
CREATE INDEX idx_prices_store      ON prices(store);
CREATE INDEX idx_meal_plans_date   ON meal_plans(plan_date);
CREATE INDEX idx_meal_plans_user   ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_house  ON meal_plans(household_id);
CREATE INDEX idx_feedback_user     ON feedback_log(user_id);
CREATE INDEX idx_feedback_type     ON feedback_log(feedback_type);