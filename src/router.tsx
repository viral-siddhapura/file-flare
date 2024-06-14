import React from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const HomePage = React.lazy(() => import('./components/Home/homePage'));

const App = () => {

    return (
        <>
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </Suspense>
            </Router>
        </>
    )
}

export default App;