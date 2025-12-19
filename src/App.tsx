import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { EventsList } from './components/EventsList';
import { EventForm } from './components/EventForm';
import { OpportunitiesList } from './components/OpportunitiesList';
import { OpportunityForm } from './components/OpportunityForm';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-slate-800 text-white px-8 py-4 flex gap-8 items-center shadow-lg">
        <h2 className="text-xl font-bold m-0">Admin Interface</h2>
        <Link
          to="/events"
          className="text-white no-underline px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          Events
        </Link>
        <Link
          to="/opportunities"
          className="text-white no-underline px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          Opportunities
        </Link>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventForm />} />
          <Route path="/opportunities" element={<OpportunitiesList />} />
          <Route path="/opportunities/:id" element={<OpportunityForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
