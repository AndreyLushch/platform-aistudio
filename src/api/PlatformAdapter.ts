/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlatformCommand, PlatformView } from '../types';

export interface PlatformAdapter {
  getView(): PlatformView;
  subscribe(callback: (view: PlatformView) => void): () => void;
  send(cmd: PlatformCommand): void;
}
