import bcrypt from 'bcryptjs'

async function run() {
  const hash = '$2b$12$txg55edCmKd9qXldx43xRO/1YCc03V4k23QWb6yfX7BxVXLVYFH8O'
  const isMatch = await bcrypt.compare('adminsetect2026', hash)
  console.log('Password Match:', isMatch)
}

run().catch(console.error)
