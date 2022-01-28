import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable, map, catchError, throwError, tap } from 'rxjs';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
//import localeES from "@angular/common/locales/es";

@Injectable({
  providedIn: 'root'
})
export class ClienteService
{
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient, private router: Router ) { }

  //getClientes(): Observable<Cliente[]>
  getClientes(page: number): Observable<any>
  {
    //return of(CLIENTES);
    //return this.httpClient.get<Cliente[]>(this.urlEndPoint);
    return this.httpClient.get(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response: any) =>
      {
        console.log('ClienteService: tap 1');
        /*let clientes = response as Cliente[];
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        });*/
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map( (response: any) =>
      {
        //let clientes = response as Cliente[];
        //return clientes.map( cliente =>
        ( response.content as Cliente[] ).map( cliente =>
        {
          cliente.nombre = cliente.nombre.toUpperCase();
          //registerLocaleData(localeES, 'es');
          //cliente.createdAt = formatDate(cliente.createdAt, 'dd/MM/yyyy', 'en-US');
          //let datePipe = new DatePipe('en-US');
          //cliente.createdAt = datePipe.transform(cliente.createdAt, 'EEEE dd, MMM-yyyy')!;
          /*let datePipe = new DatePipe('es');
          cliente.createdAt = datePipe.transform(cliente.createdAt, 'fullDate')!;*/
          return cliente;
        } );
        return response;
      }),
      tap(response =>
      {
        console.log('ClienteService: tap 2');
        //response.forEach(cliente => {
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
          
        });
      })
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
