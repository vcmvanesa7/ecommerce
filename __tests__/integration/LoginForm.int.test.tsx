//Funciones principales de RTL
import{ render, screen } from '@testing-library/react';

//userEvent para simular acciones reales del usuario
import userEvent from '@testing-library/user-event';

//Componente que vamos a probar
import LoginForm from '@/components/LoginForm';


//Antes de cada test, reemṕlazamos fetch por un mock
beforeEach(()=>{ global.fetch = jest.fn(); });

//DEspués de cada test, limpiamos los mocks
afterEach(()=>{ jest.resetAllMocks(); });

describe('LoginForm (integración + mock de red)', ()=>{
    it ('Muestra éxito cuando la API responde 200', async()=>{
        //Simulamos que la API responde bien con un usuario ADA
        (fetch as jest.Mock).mockResolvedValue({
            ok:true,
            json: async()=> ({ name: 'Ada' }),
        });

        const user = userEvent.setup();

        //RENDERIZAMOS EL FORMULARIO
        render(<LoginForm/>);

        //Escribimos un email en el input
        await user.type(screen.getByLabelText(/email/i), 'ada@example.com');

        //Hacemos click en el botón de enviar
        await user.click(screen.getByRole('button', { name: /entrar/i }));
         
        //findBytext espr


    })
})

