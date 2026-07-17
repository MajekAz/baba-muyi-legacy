# LegacyHub Phase 2 Landing Page

## Purpose

The `/legacyhub` route is the public product experience for LegacyHub as a platform. It explains what LegacyHub is, who it is for, what the current foundation supports, what is planned, and how Baba Muyi Legacy demonstrates the platform.

This milestone does not redesign Baba Muyi Legacy. The flagship archive remains Baba Muyi-focused, with LegacyHub shown only as the supporting platform relationship.

## Brand Separation

- LegacyHub is the commercial digital legacy platform.
- Baba Muyi Legacy is the first workspace, first legacy profile, and flagship public archive powered by LegacyHub.
- `/legacyhub` uses separate platform navigation and footer.
- Baba Muyi public archive routes keep the Baba Muyi header, navigation, footer, and visual identity.

## Route Status

- Route: `/legacyhub`
- Status: noindex during development until launch approval.
- Registration: not enabled.
- Billing: not enabled.
- Self-service onboarding: not enabled.
- Automatic workspace creation: not enabled.

## Current Capabilities Shown

The page may describe these as current foundation capabilities:

- Secure authentication
- Role-based permissions
- Collaborative CMS
- Publishing and review workflows
- Media library
- Photo, audio, document, and video archive
- Albums and galleries
- Audit logs
- Workspace and legacy-profile separation
- Private and public content controls

## Planned Capabilities Shown

The page labels these clearly as planned:

- Family and relationship graph
- Documentary centre
- Community contributions
- Advanced search
- Interactive maps and timelines
- Custom domains
- Subscription plans
- Self-service onboarding
- AI-assisted archive tools

## Early Access Workflow

The early-access form is a reviewed interest workflow. It collects:

- Name
- Email
- Organisation or family name
- Type of archive
- Short description
- Country
- Consent

It uses server-side validation and a honeypot field. Accepted submissions are stored in the existing Supabase `waiting_list` table with `interest` prefixed by `legacyhub:` and review metadata in `note`. It does not create a public user account, workspace, legacy profile, billing record, or subscription.

Authorised staff can review submissions through the protected Supabase project using the owner-readable `waiting_list` table. A dedicated admin lead-review interface is not part of this phase.

## Future Dedicated Domain Plan

LegacyHub may later move to a separate platform marketing domain. That future site can include features, examples, who it is for, pricing, about, login, and Create a Legacy after public registration, onboarding, billing, privacy, and support workflows are approved.

## Acceptance Notes

- The platform page must not display the Baba Muyi archive navigation or footer.
- The Baba Muyi archive must continue to display Baba Muyi Legacy as the public wordmark.
- Current and planned capabilities must remain visually and textually distinct.
- No customer counts, pricing, testimonials, partnerships, awards, launch dates, investment claims, or legal certifications should be invented.
