import { RACES } from '../src/data/birthData.js';
import { generateBestowedName } from '../src/data/namesData.js';
import { checkAnnualCrisis } from '../src/data/lifeCrisesEngine.js';
import { getMajorDecisionForAge } from '../src/data/lifeSimulationEngine.js';

console.log("=== Testing Core Races ===");
console.log(`Available Core Races count: ${RACES.length}`);
RACES.forEach(r => {
  const { fullName } = generateBestowedName(r, 'ชาย');
  console.log(`- [${r.id}] ${r.name} (${r.rarity}) => สุ่มชื่อ: ${fullName}`);
});

console.log("\n=== Testing Non-Repetition of Crises ===");
const seenCrises = new Set();
let crisisCount = 0;
for (let age = 1; age <= 70; age++) {
  const c = checkAnnualCrisis(age, { race: RACES[0] }, { health: 70, happiness: 60 }, seenCrises);
  if (c) {
    if (seenCrises.has(c.id)) {
      console.error(`ERROR: Crisis ${c.id} repeated!`);
      process.exit(1);
    }
    seenCrises.add(c.id);
    crisisCount++;
    console.log(`Age ${age}: Crisis triggered: ${c.name}`);
  }
}
console.log(`Total non-repeating crises triggered: ${crisisCount}`);

console.log("\n=== Testing Non-Repetition of Major Decisions across Lifetime ===");
const seenDecisions = new Set();
const seenIds = new Set();
const testAges = [2, 5, 8, 13, 18, 25, 35, 50, 65];

testAges.forEach(age => {
  const dec = getMajorDecisionForAge(age, { race: RACES[0] }, seenDecisions);
  if (dec) {
    if (seenIds.has(dec.id)) {
      console.error(`ERROR: Decision ${dec.id} was already triggered in this life!`);
      process.exit(1);
    }
    seenIds.add(dec.id);
    console.log(`Age ${age}: Decision triggered: ${dec.title}`);
  }
});

console.log("\nALL VERIFICATION TESTS PASSED 100%!");
