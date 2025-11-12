import mitt from 'mitt'
import type { Emitter } from '../types'

export const emitter: Emitter = mitt()
