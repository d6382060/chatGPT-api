import { 
  defineConfig,
  presetUno,
  transformerVariantGroup,
  transformerDirectives 
} from "unocss";


export default defineConfig({
  presets:[
    presetUno()
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  postprocess(util) {
    const baseFontSize = 4
    const remRE = /(-?[.\d]+)rem/g
    util.entries.forEach(i => {
      const value = i[1]
      if (value && typeof value === 'string') {
        // rem to rpx
        if (remRE.test(value)) {
          i[1] = value.replace(remRE, (_, p1) => `${p1 * baseFontSize}px`)
        }
      }
    })
  },
  preflights:[
    {
      getCSS:()=>`
      ul,li {
        list-style:none;
      }
      
      `
    }
  ]
})