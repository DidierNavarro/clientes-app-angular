import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable, map, catchError, throwError } from 'rxjs';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService
{
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient, private router: Router ) { }

  getClientes(): Observable<Cliente[]>
  {
    //return of(CLIENTES);
    //return this.httpClient.get<Cliente[]>(this.urlEndPoint);
    return this.httpClient.get(this.urlEndPoint).pipe(
      map( (response) => response as Cliente[] )
    );
  }

  create( cliente: Cliente ) : Observable<Cliente>
  {
    return this.httpClient.post(this.urlEndPoint, cliente, { headers: this.httpHeaders } )
      .pipe(
        map( (response: any) => response.cliente as Cliente ),
        catchError( e =>
        {
          console.log(e);
          if (e.status == 400)
          {
            return throwError( e );
          }
          console.error(e.error.mensaje);
          Swal.fire(
            e.error.mensaje,
            e.error.error,
            'error'
          );
          return throwError( e );
        })
      );
  }

  getCliente( id: number ) : Observable<Cliente>
  {
    return this.httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(
        catchError( e => {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
          Swal.fire(
            e.error.mensaje,
            e.error.error,
            'error'
          );
          return throwError( e );
        })
      );
  }

  updateCliente( cliente: Cliente) : Observable<any>
  {
    return this.httpClient.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders })
    .pipe(
      catchError( e => {
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        );
        return throwError( e );
      })
    );
  }

  deleteCliente( id: number) : Observable<Cliente>
  {
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders })
    .pipe(
      catchError( e => {
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        );
        return throwError( e );
      })
    );
  }
}
