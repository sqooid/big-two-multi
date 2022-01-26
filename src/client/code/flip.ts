export interface FlipProperties {
  x: number
  y: number
  width: number
  height: number
}

function objectsShallowEqual<T>(obj1: T, obj2: T): boolean {
  for (const prop in obj1) {
    if (obj1[prop] !== obj2[prop]) return false
  }
  return true
}

export interface FlipTrackerOptions {
  duration: number
  timingFunction: string
}

export class FlipTracker {
  _trackedComponents: Map<string, FlipProperties | undefined> = new Map()
  _parent?: HTMLElement

  options: FlipTrackerOptions = {
    duration: 200,
    timingFunction: 'ease-in-out',
  }

  constructor(options?: FlipTrackerOptions) {
    if (options) this.options = options
  }

  setParent(parent: HTMLElement) {
    this._parent = parent
  }

  track(id: string | string[]) {
    let idList = []
    if (typeof id === 'string') {
      idList = [id]
    } else {
      idList = id
    }

    for (let i = 0; i < idList.length; ++i) {
      const element = this._getElementById(idList[i])
      if (element === undefined) {
        this._trackedComponents.set(idList[i], undefined)
        continue
      }
      const flipProperties = this._getElementFlipProperties(element)

      this._trackedComponents.set(idList[i], flipProperties)
    }
  }

  untrack(id: string | string[]) {
    let idList = []
    if (typeof id === 'string') {
      idList = [id]
    } else {
      idList = id
    }

    for (let i = 0; i < idList.length; ++i) {
      this._trackedComponents.delete(idList[i])
    }
  }

  tick() {
    this._trackedComponents.forEach((initialProperties, id, map) => {
      const element = this._getElementById(id)
      if (element === undefined) {
        map.set(id, undefined)
        return
      }
      const currentProperties = this._getElementFlipProperties(element)
      console.log(currentProperties)
      map.set(id, currentProperties)
      if (initialProperties === undefined) {
        return
      }

      if (objectsShallowEqual(currentProperties, initialProperties)) {
        return
      }

      const deltaX = initialProperties.x - currentProperties.x
      const deltaY = initialProperties.y - currentProperties.y
      const deltaW = initialProperties.width / currentProperties.width
      const deltaH = initialProperties.height / currentProperties.height

      element.animate(
        [
          {
            transformOrigin: 'top left',
            transform: `translate(${deltaX}px,${deltaY}px) scale(${deltaW},${deltaH})`,
          },
          {
            transformOrigin: 'top left',
            transform: 'none',
          },
        ],
        {
          duration: this.options.duration,
          easing: this.options.timingFunction,
          fill: 'both',
        },
      )
    })
  }

  _getElementById(id: string): Element | undefined {
    return (
      (this._parent ?? document).querySelector(`[flip-id=${id}]`) ?? undefined
    )
  }

  _getElementFlipProperties(element: Element): FlipProperties {
    const boundingRect = element.getBoundingClientRect()
    return {
      x: boundingRect.x,
      y: boundingRect.y,
      width: boundingRect.width,
      height: boundingRect.height,
    }
  }
}
