import { Component, OnInit } from '@angular/core';
import { PeliculaService } from '../../services/pelicula';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importamos lo necesario para Formularios Reactivos

@Component({
  selector: 'app-peliculas',
  standalone: true, // Se mantiene standalone si ya lo tenías así
  imports: [CommonModule, ReactiveFormsModule], // Reemplazamos FormsModule por ReactiveFormsModule
  templateUrl: './peliculas.html',
  styleUrls: ['./peliculas.css']
})
export class Peliculas implements OnInit {

  peliculas: any[] = [];
  peliculaForm: FormGroup; // Definimos nuestro formulario reactivo
  editando = false;
  peliculaIdActual: number = 0; // Guardará el ID de la película que se está editando

  constructor(
    private service: PeliculaService,
    private fb: FormBuilder // Inyectamos FormBuilder
  ) {
    // Inicializamos el formulario con sus campos y validaciones obligatorias
    this.peliculaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.service.getAll().subscribe((data: any) => {
      this.peliculas = data;
    });
  }

  guardar() {
    // Si el formulario es inválido, marcamos todo como tocado para mostrar errores visuales
    if (this.peliculaForm.invalid) {
      this.peliculaForm.markAllAsTouched();
      return;
    }

    // Obtenemos los valores directamente del formulario reactivo
    const datosPelicula = this.peliculaForm.value;

    if (this.editando) {
      this.service.update(this.peliculaIdActual, datosPelicula).subscribe(() => {
        alert('Película actualizada con éxito 🎬');
        this.reset();
      });
    } else {
      this.service.create(datosPelicula).subscribe(() => {
        alert('Película guardada con éxito 🍿');
        this.reset();
      });
    }
  }

  editar(p: any) {
    this.editando = true;
    this.peliculaIdActual = p.id; // Guardamos el ID para la actualización
    
    // Seteamos los valores del objeto en el formulario usando patchValue (igual que tu profesora)
    this.peliculaForm.patchValue({
      nombre: p.nombre,
      descripcion: p.descripcion,
      imagen: p.imagen
    });
    
    // Hacemos scroll hacia el formulario para mejorar la experiencia
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta película?')) {
      this.service.delete(id).subscribe(() => {
        this.listar();
      });
    }
  }

  cancelarEdicion() {
    this.reset();
  }

  // Limpiamos el formulario, regresamos estados y refrescamos la lista
  reset() {
    this.editando = false;
    this.peliculaIdActual = 0;
    this.peliculaForm.reset(); // Limpia los campos y resetea el estado (touched/pristine)
    this.listar();
  }
}