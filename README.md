# Light Hunt: Platform Overview and Technical Architecture

## Executive Summary

Light Hunt is a multi-vendor marketplace specializing in holiday light display sequences, particularly for users of xLights and Light-O-Rama software. The platform connects display creators with enthusiasts in the holiday lighting community, allowing sequence creators to sell or share their work while display owners can showcase their installations.

## Core Business Components

### Marketplace Functionality
- **Sequence Marketplace**: Central hub for buying and selling digital light sequences
- **Dual Software Support**: Serves both xLights and Light-O-Rama (LOR) communities
- **Digital Product Delivery**: Facilitates downloadable content rather than physical products
- **Charitable Component**: Allows vendors to support charities through free sequences with donation options

### Display Directory
- **Comprehensive Listing**: Database of holiday light displays searchable by location
- **Music Integration**: Spotify API integration for song previews and information
- **Display Verification**: Annual verification system to ensure active displays
- **Interactive Features**: Geolocation mapping, visitor check-ins, and social sharing

### Community Engagement
- **Display Rankings**: "Light Hunt 100" and "Light Hunt 50" state-level display showcases
- **Charitable Platform**: GoFundMe integration for display owners to raise funds for charities
- **User-Generated Content**: Incentives for uploading and sharing sequences

## Technical Architecture

### Frontend
- **Framework**: Next.js/React
- **UI Components**: Custom components with React and Tailwind CSS
- **Media Handling**: Integration with YouTube for sequence previews and Spotify for music data

### Backend & Data Storage
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with multiple sign-in options (Email, Google, Facebook, Apple)
- **File Storage**: Supabase Storage for sequence files and display images

### Payment Processing
- **Provider**: Stripe
- **Integration**: Full Stripe Connect implementation for multi-vendor payments
- **Functionality**: Handles marketplace transactions, subscription services, and charity donations

### Integration Services
- **Spotify API**: For music metadata, album artwork, and song previews
- **YouTube Integration**: For sequence preview videos
- **GoFundMe**: Embedded donation widgets for charity support
- **Mapping Services**: For display directory geolocation features

### Deployment & DevOps
- **Hosting**: Vercel
- **Version Control**: GitHub
- **CI/CD**: Automated deployment pipeline
- **Project Management**: Kanban-style task tracking

## Database Schema

### Core Tables

#### displays
- **Base Fields**
  - `id`: UUID (Primary Key)
  - `name`: Text
  - `location`: Text
  - `description`: Text
  - `holiday_type`: Text
  - `display_type`: Text
  - `created_at`: Timestamp
  - `updated_at`: Timestamp
- **Enhanced Fields** (Added April 2024)
  - `status`: Enum ('active', 'archived', 'draft')
  - `views_count`: Integer (Default: 0)
  - `tags`: Text Array
  - `featured`: Boolean (Default: false)
  - `images`: Text Array

#### display_songs
- **Base Fields**
  - `id`: UUID (Primary Key)
  - `title`: Text
  - `artist`: Text
  - `year_introduced`: Integer
  - `sequence_available`: Boolean
- **Enhanced Fields**
  - `views_count`: Integer (Default: 0)
  - `duration`: Text
  - `genre`: Text
  - `youtube_url`: Text
  - `album_cover_url`: Text

### Rating & Review System
- `display_ratings`: User ratings for displays
- `sequence_ratings`: User ratings for sequences
- `display_reviews`: User reviews for displays
- `sequence_reviews`: User reviews for sequences

### E-commerce
- `purchases`: Track user purchases
- `deletion_requests`: Manage content removal requests
- `charity_campaigns`: Charity information and fundraising data

## Database Functions

### View Counting
```sql
CREATE OR REPLACE FUNCTION increment_display_views()
RETURNS TRIGGER AS $$
BEGIN
  NEW.views_count := OLD.views_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Rating Calculations
- Automatic average rating updates
- Trigger-based rating recalculation
- Separate functions for displays and sequences

## TypeScript Integration

### Type Definitions
Located in `src/integrations/supabase/types.ts`:
```typescript
interface Display {
  status: 'active' | 'archived' | 'draft';
  views_count: number;
  tags: string[];
  featured: boolean;
  // ... other fields
}
```

## Current Development Priorities

1. **Marketplace Enhancement**:
   - Improving sequence upload and preview capabilities
   - Implementing Spotify integration for music metadata
   - Developing auto-enhancement features for display photos

2. **Display Directory Expansion**:
   - Implementing interactive maps using the Mapplic WordPress plugin
   - Developing filtering systems for display properties
   - Creating curated "Top Hunts" lists by state

3. **Revenue Stream Development**:
   - Implementing charity donation features
   - Developing premium features for display owners
   - Creating affiliate programs and revenue sharing opportunities

4. **Mobile Application**:
   - iOS app development with features like radio station notifications
   - Geolocation services for display visitors
   - App Clips for physical display interaction

## Technology Stack & Tools

### Core Technologies
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **APIs**: Stripe, Spotify, YouTube
- **CMS**: WordPress with custom plugins for directory features
- **Authentication**: Multi-provider auth (Google, Facebook, Apple)

### Development Tools
- **MCP Integrations**:
  - Stripe Composio: Payment processing
  - GitHub Composio: Code management
  - Firecrawl Composio: Data extraction
  - Supabase: Database and authentication
  - Browser Tools: Debugging and testing
  - Perplexity Ask: Documentation and research

## Environment Variables
Essential environment variables for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_direct_connection_string
```

## Project Structure
```
.
├── src/
│   ├── integrations/
│   │   └── supabase/
│   │       └── types.ts
├── supabase/
│   └── migrations/
│       ├── YYYYMMDD_migration_name.sql
│       └── ...
└── .cursor/
    └── mcp.json
```

## Database Operations

### Running Migrations
```bash
# Using Supabase CLI
npx supabase db push

# Direct PostgreSQL
PGPASSWORD=your_password psql -h your_host -p 6543 -d postgres -U your_user -f migration_file.sql
```

### Database Connections
Host: aws-0-us-east-2.pooler.supabase.com
Port: 6543
Database: postgres
Schema: public

## Best Practices
1. Always use migrations for schema changes
2. Include TypeScript type updates with schema changes
3. Add appropriate indexes for new columns
4. Document changes in migration files
5. Test with sample data
6. Use RLS policies for security
7. Include trigger functions for automated tasks

## Common Issues and Solutions
1. Docker connection issues: Ensure Docker is running for local development
2. Migration failures: Check for existing objects before creating
3. Type mismatches: Update TypeScript types after schema changes
4. Permission errors: Verify RLS policies
5. Performance issues: Check index usage

## Contributing to Light Hunt

When contributing to the Light Hunt platform:

1. Use the kanban board to track task status
2. Follow the established priority system (High 🔥, Medium, Low)
3. Align new features with the appropriate roadmap timeline
4. Consider which part of the user funnel (Acquisition, Activation, Engagement, etc.) your feature impacts
5. Document code thoroughly, especially when integrating with external APIs

## Contact

For questions about the Light Hunt platform, contact:
- Email: lighthunt@towb.in
- Phone: +1 561 901 6464
