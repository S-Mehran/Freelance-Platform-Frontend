// import useAxios from "@/hooks/useAxios";
// import React, { createContext, useContext, useEffect, useState } from "react";


// interface CounterContextType {
//     count: number;
//     increment: () => void;
//     decrement: () => void;
//     reset: () => void
// }


// const CounterContext = createContext<CounterContextType|undefined>(undefined)


// export const CounterProvider = ({children}: {children: ReactNode}) => {
//     const [fetchData, response, error] = useAxios()
//     const [count, SetCount] = useState(0)

//     const increment = () => SetCount((prev)=>prev+1);
//     const decrement = ()=> SetCount((prev)=> prev-1);
//     const reset = () => SetCount(0);

//     return (
//         <CounterContext.Provider value={{count, increment, decrement, reset}}>
//             {children}
//         </CounterContext.Provider>
//     )
// }

// export const useCounter = () => {
//   const context = useContext(CounterContext);
//   if (!context) {
//     throw new Error("useCounter must be used within a CounterProvider");
//   }
//   return context;
// };