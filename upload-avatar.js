import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function uploadDefaultAvatar() {
  try {
    // Create the avatars bucket if it doesn't exist
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024, // 1MB
      })

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError
    }

    // Read the SVG file
    const fileContent = fs.readFileSync(path.join(__dirname, 'default-avatar.svg'))

    // Upload the file
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload('default-avatar.png', fileContent, {
        contentType: 'image/svg+xml',
        upsert: true
      })

    if (error) throw error
    console.log('Successfully uploaded default avatar:', data)

    // Make the file public
    const { data: publicUrl } = supabase
      .storage
      .from('avatars')
      .getPublicUrl('default-avatar.png')

    console.log('Public URL:', publicUrl)
  } catch (error) {
    console.error('Error:', error)
  }
}

uploadDefaultAvatar() 