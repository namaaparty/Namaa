const bcrypt = require("bcryptjs")

async function generateHash() {
  const password = "admin123"

  console.log("Generating bcrypt hash for password:", password)

  // Generate hash with 10 rounds
  const hash = await bcrypt.hash(password, 10)

  console.log("\nGenerated hash:", hash)

  // Test the hash
  const isValid = await bcrypt.compare(password, hash)
  console.log("Hash validation test:", isValid ? "PASSED ✓" : "FAILED ✗")

  // Output SQL to update database
  console.log("\n--- SQL to update database ---")
  console.log(`UPDATE admins SET password_hash = '${hash}' WHERE username = 'superadmin';`)
}

generateHash().catch(console.error)
