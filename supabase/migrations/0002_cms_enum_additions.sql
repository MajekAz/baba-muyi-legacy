alter type public.user_role_key add value if not exists 'administrator';
alter type public.user_role_key add value if not exists 'reviewer';
alter type public.user_role_key add value if not exists 'viewer';

alter type public.privacy_state add value if not exists 'registered';
alter type public.privacy_state add value if not exists 'invited';
alter type public.privacy_state add value if not exists 'specific_users';
alter type public.privacy_state add value if not exists 'password_protected';
