import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from './src/components/mdx-components'

export function useMDXComponents(): MDXComponents {
  return mdxComponents
}
