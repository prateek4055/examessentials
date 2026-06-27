-- Create a function to allow users to delete their own account from auth.users.
-- Since this function runs with SECURITY DEFINER, it has elevated permissions to write to auth.users,
-- but auth.uid() is still respected to ensure a user can only delete themselves.
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
