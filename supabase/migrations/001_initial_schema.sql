-- ============================================================
-- To-Do List App — Initial Schema
-- Apply to your Supabase project via the SQL editor or Supabase CLI
-- ============================================================

-- ─── Tables ───────────────────────────────────────────────────

CREATE TABLE lists (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  color      TEXT        NOT NULL DEFAULT '#007AFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE list_members (
  list_id    UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (list_id, user_id)
);

CREATE TABLE tasks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id      UUID        REFERENCES lists(id) ON DELETE CASCADE,
  creator_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  notes        TEXT,
  priority     TEXT        NOT NULL DEFAULT 'none' CHECK (priority IN ('none', 'low', 'medium', 'high')),
  due_at       TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  position     INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag     TEXT NOT NULL,
  PRIMARY KEY (task_id, tag)
);

CREATE TABLE reminders (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  remind_at  TIMESTAMPTZ NOT NULL,
  channel    TEXT        NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'push')),
  sent_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────

CREATE INDEX tasks_creator_id_idx   ON tasks(creator_id);
CREATE INDEX tasks_list_id_idx      ON tasks(list_id);
CREATE INDEX tasks_due_at_idx       ON tasks(due_at);
CREATE INDEX tasks_completed_at_idx ON tasks(completed_at);
CREATE INDEX lists_owner_id_idx     ON lists(owner_id);

-- ─── updated_at auto-trigger ──────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER lists_updated_at
  BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ────────────────────────────────────────

ALTER TABLE lists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders    ENABLE ROW LEVEL SECURITY;

-- Lists: owner full access
CREATE POLICY "lists_select" ON lists FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "lists_insert" ON lists FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "lists_update" ON lists FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "lists_delete" ON lists FOR DELETE USING (owner_id = auth.uid());

-- List members: owner manages, member can read their own row
CREATE POLICY "list_members_select" ON list_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM lists WHERE lists.id = list_id AND lists.owner_id = auth.uid())
  );
CREATE POLICY "list_members_manage" ON list_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM lists WHERE lists.id = list_id AND lists.owner_id = auth.uid())
  );

-- Tasks: creator full access
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (creator_id = auth.uid());
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (creator_id = auth.uid());
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (creator_id = auth.uid());
CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (creator_id = auth.uid());

-- Task tags: follow task ownership
CREATE POLICY "task_tags_select" ON task_tags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.creator_id = auth.uid())
  );
CREATE POLICY "task_tags_all" ON task_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.creator_id = auth.uid())
  );

-- Reminders: follow task ownership
CREATE POLICY "reminders_select" ON reminders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.creator_id = auth.uid())
  );
CREATE POLICY "reminders_all" ON reminders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.creator_id = auth.uid())
  );
