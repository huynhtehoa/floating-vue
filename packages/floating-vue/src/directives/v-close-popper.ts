import { supportsPassive } from '../util/env'

function addListeners (el) {
  el.addEventListener('mousedown', onMouseDown)
  el.addEventListener('touchstart', onTouchStart, supportsPassive
    ? {
      passive: true,
    }
    : false)
}

function removeListeners (el) {
  el.removeEventListener('mousedown', onMouseDown)
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchend', onTouchEnd)
  el.removeEventListener('touchcancel', onTouchCancel)
}

function onMouseDown (event) {
  const el = event.currentTarget
  event.closePopover = !el.$_vclosepopover_touch
  event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all
}

function onTouchStart (event) {
  if (event.changedTouches.length === 1) {
    const el = event.currentTarget
    el.$_vclosepopover_touch = true
    const touch = event.changedTouches[0]
    el.$_vclosepopover_touchPoint = touch
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchCancel)
  }
}

function onTouchEnd (event) {
  const el = event.currentTarget
  el.$_vclosepopover_touch = false
  if (event.changedTouches.length === 1) {
    const touch = event.changedTouches[0]
    const firstTouch = el.$_vclosepopover_touchPoint
    event.closePopover = (
      Math.abs(touch.screenY - firstTouch.screenY) < 20 &&
      Math.abs(touch.screenX - firstTouch.screenX) < 20
    )
    event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all
  }
}

function onTouchCancel (event) {
  const el = event.currentTarget
  el.$_vclosepopover_touch = false
}

export default {
  beforeMount (el, { value, modifiers }) {
    el.$_closePopoverModifiers = modifiers
    if (typeof value === 'undefined' || value) {
      addListeners(el)
    }
  },
  updated (el, { value, oldValue, modifiers }) {
    el.$_closePopoverModifiers = modifiers
    if (value !== oldValue) {
      if (typeof value === 'undefined' || value) {
        addListeners(el)
      } else {
        removeListeners(el)
      }
    }
  },
  beforeUnmount (el) {
    removeListeners(el)
  },
}
