/* global $ */

const openModal = (id, shown) => {
  $(id).one('shown.bs.modal', shown)

  $(id).modal({
    backdrop: 'static',
    keyboard: false,
    show: true
  })
}

export {
  openModal
}
