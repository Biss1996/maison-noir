import { db } from "./firestore";

export function testFirebase() {
  console.log("Firebase initialized");
  console.log(db);
}