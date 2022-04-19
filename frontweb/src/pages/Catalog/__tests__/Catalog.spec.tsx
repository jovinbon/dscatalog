import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import history from "util/history";
import Catalog from "..";
import { server } from './fixtures';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should render Catalog with products', async () => {

    const text = "Fazer login";

    render(
        <Router history={history}>
           <Catalog />
        </Router>
        
    );

    expect(screen.getByText('Catálago de produtos')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText('Smart TV')).toBeInTheDocument();
    });
    
});