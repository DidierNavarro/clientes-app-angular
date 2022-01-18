import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit
{
  public titulo: string = "Crear Cliente";
  public cliente: Cliente = new Cliente();
  public errores: string[] = [];

  constructor( private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void
  {
    this.cargarCliente();
  }

  public create(): void
  {
    //console.log("Clicked");
    //console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe
    (
      (cliente) =>
      {
        this.router.navigate(['/clientes']);
        Swal.fire({ title: 'Nuevo Cliente',
                    text: `El cliente: ${cliente.nombre} ha sido creado con éxito!!`,
                    icon: 'success'});
      },
      err =>
      {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  public cargarCliente() : void
  {
    this.activatedRoute.params.subscribe
    (
      params =>
      {
        let id = params['id'];
        if( id )
        {
          this.clienteService.getCliente(id).subscribe
          (
            (cliente) => this.cliente = cliente
          )
        }
      }
    )
  }

  public update(): void
  {
    this.clienteService.updateCliente(this.cliente)
      .subscribe
      (
        (response) =>
        {
          this.router.navigate(['/clientes']);
          Swal.fire({ title: 'Cliente Actualizado',
                    text: `${response.mensaje}: ${response.cliente.nombre}`,
                    icon: 'success'});
        },
        err =>
        {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

}
