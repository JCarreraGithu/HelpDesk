import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",       // usuario por defecto de XAMPP
  password: "",       // en XAMPP normalmente está vacío
  database: "helpdesk" // poné el nombre de tu BD
});

export default pool;
