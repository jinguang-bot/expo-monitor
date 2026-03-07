import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const exhibitions = [
  {
    name: "汉诺威工业博览会 (Hannover Messe)",
    description: "全球领先的工业技术展会，展示工业自动化、能源、物流等领域最新技术",
    location: "汉诺威",
    country: "德国",
    startDate: "2026-04-20",
    endDate: "2026-04-24",
    website: "https://www.hannovermesse.de",
    keywords: JSON.stringify(["Hannover Messe", "工业4.0", "工业自动化", "德国"])
  },
  {
    name: "中国国际工业博览会 (CIIF)",
    description: "中国最具影响力的工业展会之一，涵盖智能制造、工业自动化、机器人等领域",
    location: "上海",
    country: "中国",
    startDate: "2026-09-15",
    endDate: "2026-09-19",
    website: "https://www.ciif-expo.com",
    keywords: JSON.stringify(["CIIF", "工业博览会", "智能制造", "上海"])
  },
  {
    name: "芝加哥国际制造技术展 (IMTS)",
    description: "北美最大的制造技术展会,展示最新制造技术和解决方案",
    location: "芝加哥",
    country: "美国",
    startDate: "2026-09-12",
    endDate: "2026-09-17",
    website: "https://www.imts.com",
    keywords: JSON.stringify(["IMTS", "制造技术", "芝加哥", "美国"])
  },
  {
    name: "日本国际机器人展 (iREX)",
    description: "亚洲最大的机器人展会,展示最新机器人技术和服务机器人",
    location: "东京",
    country: "日本",
    startDate: "2026-03-08",
    endDate: "2026-03-11",
    website: "https://www.irex.jp",
    keywords: JSON.stringify(["iREX", "机器人", "东京", "日本"])
  },
  {
    name: "德国纽伦堡国际嵌入式系统展 (embedded world)",
    description: "欧洲领先的嵌入式系统展会,展示嵌入式技术和物联网解决方案",
    location: "纽伦堡",
    country: "德国",
    startDate: "2026-02-24",
    endDate: "2026-02-26",
    website: "https://www.embedded-world.de",
    keywords: JSON.stringify(["embedded world", "嵌入式系统", "物联网", "德国"])
  },
  {
    name: "广州国际工业自动化展 (SIAF)",
    description: "华南地区最大的工业自动化展会,展示智能制造和工业机器人",
    location: "广州",
    country: "中国",
    startDate: "2026-03-04",
    endDate: "2026-03-06",
    website: "https://www.siaf-china.com",
    keywords: JSON.stringify(["SIAF", "工业自动化", "广州", "中国"])
  },
  {
    name: "迪拜国际工业博览会 (Middle East Manufacturing)",
    description: "中东地区最大的制造技术展会,展示工业设备和制造解决方案",
    location: "迪拜",
    country: "阿联酋",
    startDate: "2026-01-19",
    endDate: "2026-01-21",
    website: "https://www.middleeastmanufacturing.com",
    keywords: JSON.stringify(["Middle East Manufacturing", "迪拜", "阿联酋"])
  },
  {
    name: "韩国国际机器人展 (ROBOT WORLD)",
    description: "韩国最大的机器人展会,展示服务机器人和工业机器人",
    location: "首尔",
    country: "韩国",
    startDate: "2026-10-06",
    endDate: "2026-10-08",
    website: "https://www.robotworld.or.kr",
    keywords: JSON.stringify(["ROBOT WORLD", "机器人", "首尔", "韩国"])
  },
  {
    name: "意大利国际机床展 (BI-MU)",
    description: "欧洲重要的机床和制造技术展会,展示金属加工和机床设备",
    location: "米兰",
    country: "意大利",
    startDate: "2026-10-08",
    endDate: "2026-10-12",
    website: "https://www.bimu.it",
    keywords: JSON.stringify(["BI-MU", "机床", "米兰", "意大利"])
  },
  {
    name: "台湾国际自动化展 (TAI)",
    description: "台湾最大的工业自动化展会,展示智能制造和自动化设备",
    location: "台北",
    country: "台湾",
    startDate: "2026-08-19",
    endDate: "2026-08-21",
    website: "https://www.taipeiautomation.com",
    keywords: JSON.stringify(["TAI", "自动化", "台北", "台湾"])
  },
  {
    name: "印度国际机床展 (IMTEX)",
    description: "南亚地区最大的机床展会,展示金属切削和成型技术",
    location: "班加罗尔",
    country: "印度",
    startDate: "2026-01-16",
    endDate: "2026-01-22",
    website: "https://www.imtex.in",
    keywords: JSON.stringify(["IMTEX", "机床", "班加罗尔", "印度"])
  },
  {
    name: "深圳国际工业制造展 (DMP)",
    description: "华南地区重要的工业制造展会,展示精密制造和智能制造",
    location: "深圳",
    country: "中国",
    startDate: "2026-03-26",
    endDate: "2026-03-28",
    website: "https://www.dmpsz.com",
    keywords: JSON.stringify(["DMP", "工业制造", "深圳", "中国"])
  },
  {
    name: "美国西部设计制造展 (WESTEC)",
    description: "美国西海岸最大的制造技术展会,展示先进制造技术",
    location: "洛杉矶",
    country: "美国",
    startDate: "2026-09-21",
    endDate: "2026-09-24",
    website: "https://www.westecshow.com",
    keywords: JSON.stringify(["WESTEC", "制造技术", "洛杉矶", "美国"])
  },
  {
    name: "泰国国际工业博览会 (MANUFACTURING EXPO)",
    description: "东南亚地区重要的制造技术展会,展示工业设备和自动化",
    location: "曼谷",
    country: "泰国",
    startDate: "2026-06-21",
    endDate: "2026-06-24",
    website: "https://www.manufacturingexpo.net",
    keywords: JSON.stringify(["MANUFACTURING EXPO", "制造技术", "曼谷", "泰国"])
  },
  {
    name: "俄罗斯国际工业展 (INNOPROM)",
    description: "俄罗斯最大的工业展会,展示工业技术和制造设备",
    location: "叶卡捷琳堡",
    country: "俄罗斯",
    startDate: "2026-07-08",
    endDate: "2026-07-11",
    website: "https://www.innoprom.com",
    keywords: JSON.stringify(["INNOPROM", "工业技术", "俄罗斯"])
  },
  {
    name: "墨西哥国际制造展 (TECMA)",
    description: "墨西哥最大的制造技术展会,展示工业设备和制造解决方案",
    location: "墨西哥城",
    country: "墨西哥",
    startDate: "2026-02-03",
    endDate: "2026-02-05",
    website: "https://www.tecma.com.mx",
    keywords: JSON.stringify(["TECMA", "制造技术", "墨西哥"])
  },
  {
    name: "新加坡国际工业博览会 (SINGA INDUSTRIAL)",
    description: "东南亚地区重要的工业展会,展示制造技术和自动化设备",
    location: "新加坡",
    country: "新加坡",
    startDate: "2026-03-10",
    endDate: "2026-03-12",
    website: "https://www.singa-industrial.com",
    keywords: JSON.stringify(["SINGA INDUSTRIAL", "工业技术", "新加坡"])
  },
  {
    name: "巴西国际机械展 (MECÂNICA)",
    description: "南美地区最大的机械制造展会,展示工业设备和自动化",
    location: "圣保罗",
    country: "巴西",
    startDate: "2026-04-13",
    endDate: "2026-04-17",
    website: "https://www.mecanica.com.br",
    keywords: JSON.stringify(["MECÂNICA", "机械制造", "圣保罗", "巴西"])
  },
  {
    name: "土耳其国际工业展 (WIN WORLD)",
    description: "中东欧地区重要的工业展会,展示工业技术和制造设备",
    location: "伊斯坦布尔",
    country: "土耳其",
    startDate: "2026-03-12",
    endDate: "2026-03-15",
    website: "https://www.winworld.com.tr",
    keywords: JSON.stringify(["WIN WORLD", "工业技术", "伊斯坦布尔", "土耳其"])
  },
  {
    name: "越南国际工业博览会 (VIETNAM MANUFACTURING EXPO)",
    description: "越南最大的制造技术展会,展示工业设备和自动化",
    location: "胡志明市",
    country: "越南",
    startDate: "2026-10-07",
    endDate: "2026-10-09",
    website: "https://www.vietnammanufacturingexpo.com",
    keywords: JSON.stringify(["VIETNAM MANUFACTURING EXPO", "制造技术", "越南"])
  },
  {
    name: "马来西亚国际工业展 (MANUFACTURING TECHNOLOGY)",
    description: "马来西亚重要的制造技术展会,展示工业设备和自动化",
    location: "吉隆坡",
    country: "马来西亚",
    startDate: "2026-05-10",
    endDate: "2026-05-13",
    website: "https://www.mfgtech.com.my",
    keywords: JSON.stringify(["MANUFACTURING TECHNOLOGY", "制造技术", "吉隆坡", "马来西亚"])
  },
  {
    name: "印尼国际工业博览会 (MANUFACTURING INDONESIA)",
    description: "印尼最大的工业展会,展示制造技术和工业设备",
    location: "雅加达",
    country: "印度尼西亚",
    startDate: "2026-12-01",
    endDate: "2026-12-04",
    website: "https://www.manufacturingindonesia.com",
    keywords: JSON.stringify(["MANUFACTURING INDONESIA", "制造技术", "雅加达", "印度尼西亚"])
  },
  {
    name: "菲律宾国际制造展 (M&E PHILIPPINES)",
    description: "菲律宾重要的制造技术展会,展示工业设备和自动化",
    location: "马尼拉",
    country: "菲律宾",
    startDate: "2026-06-03",
    endDate: "2026-06-05",
    website: "https://www.mephilippines.com",
    keywords: JSON.stringify(["M&E PHILIPPINES", "制造技术", "马尼拉", "菲律宾"])
  },
  {
    name: "澳大利亚国际制造展 (AMW)",
    description: "澳大利亚最大的制造技术展会,展示先进制造技术",
    location: "悉尼",
    country: "澳大利亚",
    startDate: "2026-05-05",
    endDate: "2026-05-08",
    website: "https://www.amw.net.au",
    keywords: JSON.stringify(["AMW", "制造技术", "悉尼", "澳大利亚"])
  },
  {
    name: "加拿大国际制造展 (CMTS)",
    description: "加拿大最大的制造技术展会,展示工业设备和自动化",
    location: "多伦多",
    country: "加拿大",
    startDate: "2026-09-30",
    endDate: "2026-10-03",
    website: "https://www.cmts.ca",
    keywords: JSON.stringify(["CMTS", "制造技术", "多伦多", "加拿大"])
  },
  {
    name: "法国国际工业展 (GLOBAL INDUSTRIE)",
    description: "欧洲重要的工业展会,展示制造技术和工业设备",
    location: "巴黎",
    country: "法国",
    startDate: "2026-03-25",
    endDate: "2026-03-28",
    website: "https://www.global-industrie.com",
    keywords: JSON.stringify(["GLOBAL INDUSTRIE", "工业技术", "巴黎", "法国"])
  },
  {
    name: "西班牙国际机床展 (BIEMH)",
    description: "西班牙最大的机床展会,展示金属加工和机床设备",
    location: "毕尔巴鄂",
    country: "西班牙",
    startDate: "2026-05-25",
    endDate: "2026-05-28",
    website: "https://www.biemh.com",
    keywords: JSON.stringify(["BIEMH", "机床", "毕尔巴鄂", "西班牙"])
  },
  {
    name: "瑞典国际工业展 (INDUSTRIE STOCKHOLM)",
    description: "北欧地区重要的工业展会,展示制造技术和自动化",
    location: "斯德哥尔摩",
    country: "瑞典",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    website: "https://www.industriestockholm.com",
    keywords: JSON.stringify(["INDUSTRIE STOCKHOLM", "工业技术", "斯德哥尔摩", "瑞典"])
  }
]

async function main() {
  console.log('Starting seeding...')

  for (const exhibition of exhibitions) {
    const created = await prisma.exhibition.create({
      data: {
        name: exhibition.name,
        description: exhibition.description,
        location: exhibition.location,
        country: exhibition.country,
        startDate: new Date(exhibition.startDate),
        endDate: new Date(exhibition.endDate),
        website: exhibition.website,
        keywords: exhibition.keywords,
      }
    })
    console.log(`Created exhibition: ${created.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
