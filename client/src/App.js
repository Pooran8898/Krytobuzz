import { Navbar } from "./Components/Navbar/Navbar";
import { Footer } from "./Components/Footer/Footer";
import { Services } from "./Components/Services/Services";
import { Transactions } from "./Components/Transactions/Transactions";
import { Welcome } from "./Components/Welcome/Welcome";
function App() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}

export default App;
