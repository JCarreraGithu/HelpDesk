// generateHash.js
import bcrypt from "bcryptjs";

const generarHash = async () => {
  const password1 = "12345"; // contraseña para Juan
  const password2 = "12345"; // contraseña para Ana

  const hash1 = await bcrypt.hash(password1, 10);
  const hash2 = await bcrypt.hash(password2, 10);

  console.log("Hash Juan:", hash1);
  console.log("Hash Ana:", hash2);
};

generarHash();
