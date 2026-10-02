import { Header } from './components/Header.jsx';
import { lessonById } from './data/course.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { AboutPage } from './pages/AboutPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { MapPage } from './pages/MapPage.jsx';

export function App() {
  const route = useHashRoute();
  const lesson = route.page === 'lesson' ? lessonById(route.id) : null;
  const page = lesson ? 'lesson' : route.page === 'lesson' ? 'home' : route.page;

  return (
    <>
      <Header page={page} />
      <main className="wrap" id="app">
        {page === 'home' && <HomePage />}
        {page === 'map' && <MapPage />}
        {page === 'about' && <AboutPage />}
        {/* key: a fresh lesson page (and fresh toys) for every lesson */}
        {page === 'lesson' && <LessonPage key={lesson.id} lesson={lesson} />}
      </main>
    </>
  );
}
