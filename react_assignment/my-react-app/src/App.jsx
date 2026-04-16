

import Q1_ProfileCard from "./assignments/Q1_ProfileCard";

import Q2_ReusableButton from  "./assignments/Q2_ReusableButton";

import Q3_ProuctCardGrid from "./assignments/Q3_ProductCardGrid";

import Q4_CounterWithLimits from "./assignments/Q4_CounterWithLimits";

import Q5_ToggleTheme from "./assignments/Q5_ToggleTheme";

import Q6_LoginLogout from "./assignments/Q6_LoginLogout";

import Q7_TodoList from "./assignments/Q7_TodoList";

import Q8_StudentList from "./assignments/Q8_StudentList";

import Q9_LiveClock from "./assignments/Q9_LiveClock";

import Q10_UsersFetcher from "./assignments/Q10_UsersFetcher";

import Q11_DocumentTitleTracker from "./assignments/Q11_DocumentTitleTracker";

import Q12_ExpensiveFilter from "./assignments/Q12_ExpensiveFilter";

import Q13_PrimeCalculator from "./assignments/Q13_PrimeCalculator";

import Q14_TodoWithUseCallback from "./assignments/Q14_TodoWithUseCallback";

import Q15_CounterChildButton from "./assignments/Q15_CounterChildButton";

import Q1_RegistrationForm from "./react_day_2_assignment/Q1_RegistrationForm";

import Q2_TempConverter from "./react_day_2_assignment/Q2_TempConverter";

import Q3_DynamicSurveyForm from "./react_day_2_assignment/Q3_DynamicSurveyForm";

import Q4_ThemeLanguageContext from "./react_day_2_assignment/Q4_ThemeLanguageContext";

import Q5_ShoppingCart from "./react_day_2_assignment/Q5_ShoppingCart";

import Q6_MultiStepForm from "./react_day_2_assignment/Q6_MultiStepForm";

import Q7_useFetch from "./react_day_2_assignment/Q7_useFetch";

import Q8_useLocalStorage from "./react_day_2_assignment/Q8_useLocalStorage";

import Q9_useDebounce from "./react_day_2_assignment/Q9_useDebounce";

import Q10_Stopwatch from "./react_day_2_assignment/Q10_Stopwatch";

import Q11_BlogRouter from "./react_day_2_assignment/Q11_BlogRouter";

import Q12_ProtectedDashboard from "./react_day_2_assignment/Q12_ProtectedDashboard";

import Q13_CRUDAxios from "./react_day_2_assignment/Q13_CRUDAxios";

import Q14_ErrorBoundaryLazy from "./react_day_2_assignment/Q14_ErrorBoundaryLazy";

import Q15_OptimizedList from "./react_day_2_assignment/Q15_OptimizedList";

import Q16_ReduxCounter from "./react_day_2_assignment/Q16_ReduxCounter";

import Q17_ReduxTodo from "./react_day_2_assignment/Q17_ReduxTodo";

import Q18_ReduxAuthRoutes from "./react_day_2_assignment/Q18_ReduxAuthRoutes";

import Q19_AsyncThunk from "./react_day_2_assignment/Q19_AsyncThunk";

import Q20_MultiSliceShoppingCart from "./react_day_2_assignment/Q20_MultiSliceShoppingCart";
import { connect } from "react-redux";

function App() {
  return (
    <div className="app"> 

      <h1>Assignmemnt_1</h1>
      <div className="assignment-container"> 
        <Q1_ProfileCard/>
        </div>
      <h1>Assignmemnt_2</h1>

      <div className=" assignment-container">
        <Q2_ReusableButton/>
      </div>
      <h1>Assignment_3</h1>
      <div className=" assignment-container">
        <Q3_ProuctCardGrid/>
      </div>

      <h1>Assignmemnt_4</h1>
      <div className="assignment-container"> 
        <Q4_CounterWithLimits/>
      </div>
      
      <h1>Assignmemnt_5</h1>
      <div className="assignment-container"> 
        <Q5_ToggleTheme/>
      </div>

      <h1>Assignment_6</h1>
      <div class = "assignment-container">
        <Q6_LoginLogout/>
      </div>

      <h1>Assignment_Q7</h1>
      <div class = "assignment-container">
        <Q7_TodoList/>
      </div>

      <h1>Assignment_Q8</h1>
      <div class = "assignment-container">
        <Q8_StudentList/>
      </div>

      <h1>Assignment_Q9</h1>
      <div class = "assignment-container">
        <Q9_LiveClock/>
      </div>

      <h1>Assignment_Q10</h1>
      <div class = "assignment-container">
        <Q10_UsersFetcher/>
      </div>

      <h1>Assignment_Q11</h1>
      <div class = "assignment-container">
        <Q11_DocumentTitleTracker/>
      </div>

      <h1>Assignment_Q12</h1>
      <div class = "assignment-container">
        <Q12_ExpensiveFilter/>
      </div>

      <h1>Assignment_Q13</h1>
      <div class = "assignment-container">
        <Q13_PrimeCalculator/>
      </div>

      <h1>Assignment_14</h1>
      <div class = "assignment-container">
        <Q14_TodoWithUseCallback/>
      </div>

      <h1>Assignment_15</h1>
      <div class = "assignment-container">
        <Q15_CounterChildButton/>
      </div>

      
      <h1 id="child">Day_2</h1>
     
      <h1>Assignment_1</h1>
      <div class = "assignment-container">
        <Q1_RegistrationForm/>
      </div>

      <h1>Assignment_2</h1>
      <div class = "assignment-container">
        <Q2_TempConverter/>
      </div>

      <h1>Assignment_3</h1>
      <div class = "assignment-container">
        <Q3_DynamicSurveyForm/>
      </div>

      <h1>Assignment_4</h1>
      <div class = "assignment-container">
        <Q4_ThemeLanguageContext/>
      </div>

      <h1>Assignment_5</h1>
      <div class = "assignment-container">
        <Q5_ShoppingCart/>
      </div>

      <h1>Assignment_6</h1>
      <div class = "assignment-container">
        <Q6_MultiStepForm/>
      </div>

      <h1>Assignment_7</h1>
      <div class = "assignment-container">
        <Q7_useFetch/>
      </div>

      <h1>Assignment_8</h1>
      <div class = "assignment-container">
        <Q8_useLocalStorage/>
      </div>

       <h1>Assignment_9</h1>
      <div class = "assignment-container">
        <Q9_useDebounce/>
      </div>

       <h1>Assignment_10</h1>
      <div class = "assignment-container">
        <Q10_Stopwatch/>
      </div>

      <h1>Assignment_11</h1>
      <div class = "assignment-container">
        <Q11_BlogRouter/>
      </div>

      <h1>Assignment_12</h1>
      <div class = "assignment-container">
        <Q12_ProtectedDashboard/>
      </div>

      <h1>Assignment_13</h1>
      <div class = "assignment-container">
        <Q13_CRUDAxios/>
      </div>

      <h1>Assignment_14</h1>
      <div class = "assignment-container">
        <Q14_ErrorBoundaryLazy/>
      </div>

      <h1>Assignment_15</h1>
      <div class = "assignment-container">
        <Q15_OptimizedList/>
      </div>

      <h1>Assignment_16</h1>
      <div class = "assignment-container">
        <Q16_ReduxCounter/>
      </div>

      <h1>Assignment_17</h1>
      <div class = "assignment-container">
        <Q17_ReduxTodo/>
      </div>

      <h1>Assignment_18</h1>
      <div class = "assignment-container">
        <Q18_ReduxAuthRoutes/>
      </div>

      <h1>Assignment_19</h1>
      <div class = "assignment-container">
        <Q19_AsyncThunk/>
      </div>

      <h1>Assignment_20</h1>
      <div class = "assignment-container">
        <Q20_MultiSliceShoppingCart/>
      </div>

    </div>
  );
}

export default App;