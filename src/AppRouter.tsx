import React from 'react';
import { Routes, Route } from "react-router-dom";import Todo from './pages/Todo';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/todo" element={<Todo />} />
    </Routes>
    
      )

}
export default AppRouter
