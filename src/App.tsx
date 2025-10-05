import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SchoolCodeInputPage from "./app/pages/setup/SchoolCodeInputPage";
import { Wizard } from "react-use-wizard";
import ProgramSelectScreen from "./app/pages/setup/ProgramSelectScreen";

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <Wizard>
          <SchoolCodeInputPage />
          <ProgramSelectScreen />
        </Wizard>
      </main>
    </QueryClientProvider>
  );
}

export default App;
