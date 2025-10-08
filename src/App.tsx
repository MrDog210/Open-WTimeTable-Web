import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SchoolCodeInputPage from "./app/pages/setup/SchoolCodeInputPage";
import { Wizard } from "react-use-wizard";
import ProgramSelectScreen from "./app/pages/setup/ProgramSelectScreen";
import UserSettingsContextProvider, { useSettings } from "./context/UserSettingsContext";
import TimetablePage from "./app/pages/main/TimetablePage";

const queryClient = new QueryClient()

function Navigation() {
  const { hasCompletedSetup } = useSettings()

  return (
    <>
      {
        hasCompletedSetup ? <TimetablePage /> : <Wizard>
          <SchoolCodeInputPage />
          <ProgramSelectScreen />
        </Wizard>
      }
    </>
  )
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <UserSettingsContextProvider>
        <Navigation />
      </UserSettingsContextProvider>
    </QueryClientProvider>
  );
}

export default App;
