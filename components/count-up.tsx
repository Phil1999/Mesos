"use client" // Only run this component during SSR phase, Therefore client side behaviors will
// only run when the app is hydrated.

// Since react-countup is an old library it doesnt behave well with nextjs and hydration.
// by defining it like this we can solve the issue. We ensure that the CountUp component
// is only rendered on the client side.
import CountUp from "react-countup"
export { CountUp }