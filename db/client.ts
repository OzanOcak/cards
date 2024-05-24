import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite/next"

const expoDb = openDatabaseSync("notes7.db")

export const db = drizzle(expoDb)
