// =====================================
// INPUT
// =====================================
const students = [
  { name: "Alice", scores: [85, 92, 78] },
  { name: "Bob", scores: [45, 55, 60] },
  { name: "Carol", scores: [90, 95, 88] },
  { name: "Dave", scores: [30, 40, 35] },
  { name: "Eve", scores: [72, 68, 75] },
];


// =====================================
// PIPELINE (METHOD CHAINING)
// =====================================
const result = students
  // Step 1: Calculate average (2 decimal places)
  .map(student => {
    const avg =
      student.scores.reduce((sum, s) => sum + s, 0) /
      student.scores.length;

    return {
      name: student.name,
      average: Number(avg.toFixed(2))
    };
  })

  // Step 2: Filter avg >= 60
  .filter(student => student.average >= 60)

  // Step 3: Sort descending
  .sort((a, b) => b.average - a.average)

  // Step 4: Assign grades
  .map(student => ({
    ...student,
    grade:
      student.average >= 90 ? "A" :
      student.average >= 80 ? "B" :
      student.average >= 70 ? "C" : "D"
  }));


// =====================================
// OUTPUT
// =====================================
console.log(result);