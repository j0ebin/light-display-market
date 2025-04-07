# Light Display Market - Cursor Project Guide

## Project Overview
Light Display Market is a platform for sharing and discovering holiday light displays. The application uses Supabase for backend services and includes features for display management, user interactions, and e-commerce capabilities.

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

## Recent Enhancements (April 2024)

### 1. Display Status Management
```sql
ALTER TABLE displays ADD COLUMN status text DEFAULT 'active'
CHECK (status IN ('active', 'archived', 'draft'));
```
- Enables display lifecycle management
- Supports draft mode for work-in-progress displays
- Allows archiving old displays

### 2. View Tracking System
```sql
ALTER TABLE displays ADD COLUMN views_count integer DEFAULT 0;
ALTER TABLE display_songs ADD COLUMN views_count integer DEFAULT 0;
```
- Automatic view counting through triggers
- Separate counters for displays and songs
- Analytics support for popularity tracking

### 3. Display Categorization
```sql
ALTER TABLE displays ADD COLUMN tags text[] DEFAULT '{}';
CREATE INDEX idx_displays_tags ON displays USING gin(tags);
```
- Array-based tagging system
- GIN index for efficient tag searches
- Flexible categorization support

### 4. Featured Content
```sql
ALTER TABLE displays ADD COLUMN featured boolean DEFAULT false;
CREATE INDEX idx_displays_featured ON displays USING btree(featured) WHERE featured = true;
```
- Highlight special displays
- Partial index for efficient featured content queries

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

## Testing

### Sample Data
- Various display statuses
- Different tag combinations
- View count simulation
- Featured content examples

### Test Queries
1. Status filtering
2. Featured display listing
3. Tag-based searching
4. View count verification
5. Trigger functionality testing

## MCP Configuration
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "YOUR_TOKEN"
      ]
    }
  }
}
```

## Environment Variables
Essential environment variables for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_direct_connection_string
```

## Common Operations

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

## Future Enhancements
1. Analytics dashboard using view counts
2. Advanced tag-based search
3. Featured content rotation system
4. Archive management system
5. Enhanced review moderation 