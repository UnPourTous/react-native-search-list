'use strict';
import {
  isCharacter,
  sTrim,
  containsChinese
} from './utils/utils';
import pinyin from 'js-pinyin';

export default class SearchService {
  static search (source, searchStr) {
    let tempResult = [];
    source.forEach((item, idx, array) => {
      if (item) {
        // 全局匹配字符
        if (item.searchStr) {
          let searchHandler = item.searchHandler;
          let result = SearchService.generateMacherInto(
            item.searchStr,
            item,
            searchStr,
            searchHandler ? searchHandler.translatedStr : '',
            searchHandler ? searchHandler.charIndexerArr : []);
          if (result.matcher) {
            tempResult.push(result);
          }
        }
      }
    });
    return tempResult;
  }
  // FIXME 这个函数需要改造为一个字符串匹配多项
  static generateMacherInto (source, item, inputLower, transStr, charIndexer) {
    let result = {};
    Object.assign(result, item);
    if (source) {
      let matcher = {};
      matcher.matches = [];
      if (source.toLowerCase().indexOf(inputLower) >= 0) {
        matcher.charMatchStartIndex = source.toLowerCase().indexOf(inputLower);
        matcher.charMatchEndIndex = matcher.charMatchStartIndex + inputLower.length;

        matcher.matches.push({'start': matcher.charMatchStartIndex, 'end': matcher.charMatchEndIndex});
        result.matcher = matcher;
      } else {
        if (transStr && charIndexer) {
          let inputStartIndex = transStr.indexOf(inputLower);
          if (inputStartIndex >= 0) {
            for (let i = 0; i < charIndexer.length; i++) {
              let startCharIndexer = charIndexer[i];

              if (startCharIndexer) {
                if (startCharIndexer.startIndexInTransedStr === inputStartIndex) {
                  let inputEndIndex = inputStartIndex + inputLower.length - 1;
                  let find = false;
                  for (let j = i; j < charIndexer.length; j++) {
                    let endCharIndexer = charIndexer[j];

                    if (inputEndIndex <= endCharIndexer.endIndexInTransedStr) {
                      find = true;
                      matcher.charMatchStartIndex = startCharIndexer.index;
                      matcher.charMatchEndIndex = endCharIndexer.index + 1;
                      matcher.matches.push({'start': matcher.charMatchStartIndex, 'end': matcher.charMatchEndIndex});
                      result.matcher = matcher;
                      break;
                    }
                  }

                  if (find) {
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    return result;
  }

  static sortResultList (searchResultList, resultSortFunc) {
    searchResultList.sort(resultSortFunc || function (a, b) {
      if (b.matcher && a.matcher) {
        if (b.matcher.charMatchStartIndex < a.matcher.charMatchStartIndex) {
          return 1;
        } else if (b.matcher.charMatchStartIndex > a.matcher.charMatchStartIndex) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

    const { formattedData } = this.parseList(searchResultList);

    return {
      searchResultData: formattedData
    };
  }

  static generateSearchHandler (source) {
    let searchHandler = null;
    if (containsChinese(source)) {
      searchHandler = {};
      searchHandler.charIndexerArr = [];
      searchHandler.translatedStr = '';

      let translatedLength = 0;
      for (let i = 0; i < source.length; i++) {
        let tempChar = source[i];

        let pinyinStr = pinyin.getFullChars(tempChar);

        let charIndexer = {};
        charIndexer.index = i;
        charIndexer.startIndexInTransedStr = translatedLength;
        charIndexer.endIndexInTransedStr = translatedLength + pinyinStr.length - 1;
        charIndexer.pinyinStr = pinyinStr.toLowerCase();

        searchHandler.charIndexerArr.push(charIndexer);

        translatedLength += pinyinStr.length;
        searchHandler.translatedStr += pinyinStr.toLowerCase();
      }
    }
    return searchHandler;
  }

  static parseList (sourceData) {
    let formattedData = [];
    const sectionIds = [];

    sourceData.forEach((item) => {
      if (item) {
        // 加入到section
        let orderIndex = item.orderIndex;
        if (!isCharacter(item.orderIndex)) {
          orderIndex = '#';
        }
        if (!sectionIds.includes(orderIndex)) {
          sectionIds.push(orderIndex);
          formattedData.push({ title: orderIndex, data: [] });
        }

        const rowData = formattedData.find((object) => {
          return object.title === orderIndex;
        });

        rowData.data.push(item);
      }
    });

    return {
      formattedData,
      sectionIds
    };
  }

  static initList (sourceData) {
    sourceData.forEach((item) => {
      if (item) {
        // 生成排序索引
        item.orderIndex = '';
        item.isChinese = 0;

        if (item.searchStr) {
          let tempStr = sTrim(item.searchStr);

          if (tempStr !== '') {
            // 补充首字母
            let firstChar = item.searchStr[0];

            if (containsChinese(firstChar)) {
              let pinyinChar = pinyin.getCamelChars(firstChar);

              if (pinyinChar) {
                item.orderIndex = pinyinChar.toUpperCase();
                item.isChinese = 1;
              }
            } else {
              item.orderIndex = firstChar.toUpperCase();
              item.isChinese = 0;
            }
          }
          // 对中文进行处理
          let handler = SearchService.generateSearchHandler(item.searchStr);
          if (handler) {
            item.searchHandler = handler;
          }
        }
      }
    });
    return sourceData;
  }

  static sortList (sourceData, sortFunc) {
    sourceData.sort(sortFunc || function (a, b) {
      if (!isCharacter(b.orderIndex)) {
        return -1;
      } else if (!isCharacter(a.orderIndex)) {
        return 1;
      } else if (b.orderIndex > a.orderIndex) {
        return -1;
      } else if (b.orderIndex < a.orderIndex) {
        return 1;
      } else {
        if (b.isChinese > a.isChinese) {
          return -1;
        } else if (b.isChinese < a.isChinese) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    return sourceData;
  }
}
