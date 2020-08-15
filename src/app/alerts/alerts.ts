import Swal from 'sweetalert2';

const Notification = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});


const showNotification = (icon, title) => {
  Notification.fire({
    icon,
    title,
  });
};

const questionAlert = (text) => {
  return Swal.fire({
    title: 'Esta seguro?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, bórralo!'
  });
}

export { showNotification, questionAlert };
