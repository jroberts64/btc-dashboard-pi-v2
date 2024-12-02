

function getHour(hour) {
  const num = new Intl.NumberFormat("en-US")
    .format(hour % 12 ? hour % 12 : 12)
  return num
}
function getAmPm(hour) {
  return Math.floor(hour / 12) ? "PM" : "AM"
}
export default function getDateTime( date = new Date(), seconds = false, sep = " @ " ) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

   return months[date.getMonth()]  + " "
    + date.getDate() + ", "
    + date.getFullYear() 
    + sep
    + getHour(date.getHours()) + ":"
    + new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 })
      .format(date.getMinutes())
    + (seconds ? ":" + new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 })
      .format(date.getSeconds()) + " " : " ")
    + getAmPm(date.getHours())
}

// Example usage:
// const I2 = 2023; // Example year from cell I2
// const W12 = 1;   // Example value from cell W12
// const W13 = 2;   // Example value from cell W13
// console.log(calculateValue(I2, W12, W13));

// export function getPowerLawData(startDate) {
//   const slope = 7
//   const intercept = -17
//   // Get the current date 
  
//   // Create a new date with the year from I2 and the current month and day
//   // const currentDate = new Date(year, today.getMonth(), today.getDate());
  
//   // Create the reference date (January 3, 2009)
//   const genesisBlock = new Date(2009, 0, 3);
  
//   // Calculate the difference in days between the two dates
//   const diffInDays = (startDate - genesisBlock) / (1000 * 60 * 60 * 24);
  
//   // Calculate the base-10 logarithm of the difference in days
//   const logValue = Math.log10(diffInDays);
  
//   // Calculate the final value using the formula
//   const result = Math.pow(10, logValue * slope + intercept);
//   return Math.round(result,0);
// }

