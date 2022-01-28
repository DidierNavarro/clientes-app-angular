import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit
{
  clientes: Cliente[] = [];
  paginador: any;

  constructor( private clienteService: ClienteService, private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void
  {
    this.activatedRoute.paramMap.subscribe
    (
      params =>
      {
        let page: number = +params.get('page')!;
        if (!page)
        {
          page = 0;
        }
        this.clienteService.getClientes(page)
          .pipe(
            tap(response =>
            {
              console.log('ClientesComponent: tap 3');
              (response.content as Cliente[]).forEach(cliente =>
              {
                console.log(cliente.nombre);
              });
              //this.clientes = clientes;
            })
          )
          .subscribe(
            //(clientes) => this.clientes = clientes
            response =>
            {
              this.clientes = response.content as Cliente[];
              this.paginador = response;
            }
          );
      }
    );
  }

  delete( cliente: Cliente ) : void
  {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estás Seguro?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed)
      {
        this.clienteService.deleteCliente(cliente.id)
          .subscribe
            (
              (response) =>
              {
                this.clientes = this.clientes.filter( cli => cli !== cliente);

                Swal.fire(
                  'Cliente Eliminado',
                  `Cliente ${cliente.nombre} eliminado con éxito`,
                  'success'
                );
              }
            );
          //swalWithBootstrapButtons.fire(
          //  'Deleted!',
          //  'Your file has been deleted.',
          //  'success'
          //)
      }
      else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      )
      {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El archivo no ha sido borrado',
          'error'
        )
      }
    });
  }
}
