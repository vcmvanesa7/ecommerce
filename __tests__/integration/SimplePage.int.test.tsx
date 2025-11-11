import  {  render, screen } from '@testing-library/react';  

//use event simula acciones del ususario: click, escritura, teclado, etc.
import userEvent from '@testing-library/user-event';
//Importamos la página que integra varios componentes
import SimplePage from '@/components/SimplePage/SimplePage';

describe('SimplePage (INtegración simple por props)', ()=>{
    it ('actualiza el valor al hacer click en + y -', async()=>{
        //Preparamos simulador de ususario
        const user = userEvent.setup();

        //renderizamos la página completa
        render(<SimplePage/>);

        //Obtenemos el span que muestra el valor actual (aria-label="count")
        const value = screen.getByLabelText('count');
        //verificamos estado inicial
        expect(value).toHaveTextContent('0');

        //Simulamos click en el botón +
        await user.click(screen.getByRole('button', {name: '+'}));
        //Validamos incremento
        expect(value).toHaveTextContent('1');

        //Simulamos click en el botón -
        await user.click(screen.getByRole('button', {name: '-'}));
        //Validamos que vuelva a 0
        expect(value).toHaveTextContent('0');
    })
})