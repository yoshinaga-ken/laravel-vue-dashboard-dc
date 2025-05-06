<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElTag, ElButton, ElInput, ElAutocomplete, ElDatePicker, ElIcon } from 'element-plus'
import dayjs from 'dayjs'
import * as ElementPlusIcons from '@element-plus/icons-vue'

// トークンの型定義
type TokenValue = {
  data: string | number | Date
  operator: string
}

type Token = {
  type: string
  value: TokenValue
}

type TagOptions = {
  effect?: 'dark' | 'light' | 'plain'
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  color?: string
  size?: 'large' | 'default' | 'small'
}

// タグのオブジェクト型
type TagObject = {
  id: string | number
  name: string
  icon?: string
}

type TokenDefinition = {
  type: string
  icon?: string
  title: string
  tagOptions?: TagOptions
  tags: string[] | TagObject[] | 'DatePicker' | 'InputNumber'
  tagsComponentOptions?: Record<string, any> // コンポーネントオプション用
  operators: string[]
}

// トークングループの型定義（Key, Operator, Value の組）
type TokenGroup = {
  key: {
    type: string
    title: string
    isCustom?: boolean
    isStringValue?: boolean
  }
  operator: string
  value: string | number | Date
  displayValue?: string | number | Date // 表示用の値
  valueIcon?: string | null // アイコン情報
  editing?: 'key' | 'operator' | 'value' | null
}
const props = defineProps({
  availableTokens: {
    type: Array as () => TokenDefinition[],
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  inputPlaceholder: {
    type: String,
    default: 'Enter search queries (<key><operator><value>)...'
  }
})

const modelValue = defineModel<Token[]>({
  default: () => []
})

const emit = defineEmits(['keydown-enter'])

// 表示用トークングループ配列
const tokenGroups = computed<TokenGroup[]>(() => {
  return modelValue.value.map(token => {
    const tokenDef = props.availableTokens.find(t => t.type === token.type)

    // stringタイプの場合は特別処理
    if (token.type === 'string') {
      return {
        key: {
          type: 'string',
          title: token.value.data as string,
          isCustom: true,
          isStringValue: true // stringタイプを識別するフラグ
        },
        operator: '',
        value: '',
        displayValue: token.value.data, // 表示用の値
        valueIcon: null, // アイコン情報
        editing: null
      }
    }

    // 保存値と表示値を計算
    let displayValue = token.value.data;
    let valueIcon = null;

    // タグオブジェクトの場合、表示用の値とアイコンを設定
    if (tokenDef && Array.isArray(tokenDef.tags)) {
      const tagObj = tokenDef.tags.find(tag =>
        typeof tag === 'object' && tag !== null && tag.id === token.value.data
      );

      if (tagObj) {
        displayValue = tagObj.name;
        valueIcon = tagObj.icon || null;
      }
    }

    return {
      key: {
        type: token.type,
        title: tokenDef?.title || token.type,
        isCustom: !tokenDef
      },
      operator: token.value.operator,
      value: token.value.data,
      displayValue, // 表示用の値
      valueIcon,    // アイコン情報
      editing: null
    }
  })
})
// 入力状態の管理
const inputVisibleState = ref(true)
const inputVisible = computed(() => {
  return props.disabled ? false : inputVisibleState.value
})
const inputValue = ref('')
const inputStep = ref<'key' | 'operator' | 'value'>('key')
const currentTokenGroup = ref<TokenGroup | null>(null)
const editingTokenIndex = ref<number | null>(null)
const inputRef = ref<InstanceType<typeof ElAutocomplete> | null>(null)
const isInputRefFocus = ref(false)
const datePickerRef = ref<InstanceType<typeof ElDatePicker> | null>(null)

// 編集状態の初期表示かどうかを管理する変数
const initialEditMode = ref(false)

const datePickerOptions = computed(() => {
  if (!currentTokenGroup.value) return {}

  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  return tokenDef?.tagsComponentOptions || {}
})

const inputNumberOptions = computed(() => {
  if (!currentTokenGroup.value) return {}

  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  return tokenDef?.tagsComponentOptions || {}
})

defineExpose({
  /** @description el-autocomplete|el-input component instance */
  inputRef,
  /** @description input ref whether focus */
  isInputRefFocus,
  /** @description el-date-picker component instance */
  datePickerRef,
})

const handleInputFocus = () => {
  isInputRefFocus.value = true
}

// 入力イベント処理 - キー入力時にフィルタリングモードに切り替える
const handleInputChange = () => {
  initialEditMode.value = false
}

// キーの候補を取得
const getKeySuggestions = (queryString: string, cb: (data: any[]) => void) => {
  // 初期編集モードかつクエリ文字列がある場合は全アイテムを表示（フィルタなし）
  if (initialEditMode.value && queryString) {
    initialEditMode.value = false // 一度表示した後はフラグをオフにする
    const results = props.availableTokens.map(token => ({ value: token.title, item: token }))
    // フォーカスを現在のクエリ文字列と一致するアイテムに設定
    const focusItem = results.findIndex(item => item.value.toLowerCase() === queryString.toLowerCase())
    if (focusItem !== -1) {
      setTimeout(() => {
        // DOMでフォーカスを設定する処理があれば実装
      }, 50)
    }
    cb(results)
    return
  }

  const results = queryString
    ? props.availableTokens
      .filter(token => token.title.toLowerCase().includes(queryString.toLowerCase()))
      .map(token => ({ value: token.title, item: token }))
    : props.availableTokens.map(token => ({ value: token.title, item: token }))
  cb(results)
}

// オペレーターの候補を取得
const getOperatorSuggestions = (queryString: string, cb: (data: any[]) => void) => {
  if (!currentTokenGroup.value) return cb([])

  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  if (!tokenDef) return cb([])

  const operators = tokenDef.operators

  // 初期編集モードかつクエリ文字列がある場合は全アイテムを表示（フィルタなし）
  if (initialEditMode.value && queryString) {
    initialEditMode.value = false // 一度表示した後はフラグをオフにする
    const results = operators.map(op => ({ value: op }))
    // 現在のクエリと一致する項目にフォーカスを当てる
    const focusItem = results.findIndex(item => item.value.toLowerCase() === queryString.toLowerCase())
    if (focusItem !== -1) {
      setTimeout(() => {
        // DOMでフォーカスを設定する処理があれば実装
      }, 50)
    }
    cb(results)
    return
  }

  const results = queryString
    ? operators
      .filter(op => op.includes(queryString))
      .map(op => ({ value: op }))
    : operators.map(op => ({ value: op }))
  cb(results)
}

// 値の候補を取得
const getValueSuggestions = (queryString: string, cb: (data: any[]) => void) => {
  if (!currentTokenGroup.value) return cb([])

  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  if (!tokenDef) return cb([])

  const tagsDef = tokenDef.tags

  // DatePicker用の特殊処理
  if (tagsDef === 'DatePicker') {
    return cb([])
  }

  // 通常の配列の場合
  const tags = Array.isArray(tagsDef)
    ? tagsDef
    : []

  // 初期編集モードかつクエリ文字列がある場合は全アイテムを表示（フィルタなし）
  if (initialEditMode.value && queryString) {
    initialEditMode.value = false // 一度表示した後はフラグをオフにする
    const results = tags.map(tag => {
      if (typeof tag === 'object' && tag !== null) {
        // オブジェクトの場合は元のオブジェクトを保持し、valueプロパティに表示用のテキストを設定
        return { value: tag.name, item: tag }
      } else {
        // 文字列の場合は従来通り
        return { value: tag }
      }
    })

    // 現在のクエリに一致する項目にフォーカスを当てる
    const focusItem = results.findIndex(item => {
      return item.value.toLowerCase() === queryString.toLowerCase()
    })
    if (focusItem !== -1) {
      setTimeout(() => {
        // DOMでフォーカスを設定する処理があれば実装
      }, 50)
    }
    cb(results)
    return
  }

  const results = queryString
    ? tags
      .filter(tag => {
        const tagValue = typeof tag === 'object' && tag !== null ? tag.name : tag
        return String(tagValue).toLowerCase().includes(queryString.toLowerCase())
      })
      .map(tag => {
        if (typeof tag === 'object' && tag !== null) {
          // オブジェクトの場合は元のオブジェクトを保持し、valueプロパティに表示用のテキストを設定
          return { value: tag.name, item: tag }
        } else {
          // 文字列の場合は従来通り
          return { value: tag }
        }
      })
    : tags.map(tag => {
      if (typeof tag === 'object' && tag !== null) {
        // オブジェクトの場合は元のオブジェクトを保持し、valueプロパティに表示用のテキストを設定
        return { value: tag.name, item: tag }
      } else {
        // 文字列の場合は従来通り
        return { value: tag }
      }
    })
  cb(results)
}

// 現在の入力ステップに応じたプレースホルダー
const getCurrentPlaceholder = computed(() => {
  if (!isInputRefFocus.value && currentTokenGroup.value === null && modelValue.value.length === 0) return props.inputPlaceholder
  switch (inputStep.value) {
    case 'key':
      return 'Enter key...'
    case 'operator':
      return 'Enter operator...'
    case 'value':
      return 'Enter value...'
    default:
      return props.inputPlaceholder
  }
})

// トークングループの削除
const handleTokenGroupClose = (index: number) => {
  if (props.disabled) return
  modelValue.value.splice(index, 1)
}

// 入力フィールドの表示
const showInput = () => {
  if (props.disabled) return

  inputVisibleState.value = true
  inputStep.value = 'key'
  if (inputRef.value?.highlightedIndex) inputRef.value.highlightedIndex = 0
  currentTokenGroup.value = null
  editingTokenIndex.value = null
  inputValue.value = ''

  nextTick(() => {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 200)
  })
}

// 値が日付入力かどうかをチェック
const isDatePicker = computed(() => {
  if (!currentTokenGroup.value) return false
  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  return tokenDef?.tags === 'DatePicker'
})

// 値が日付範囲入力かどうかをチェック
const isDateRangePicker = computed(() => {
  if (!currentTokenGroup.value) return false
  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  return tokenDef?.tags === 'DatePicker' && tokenDef?.tagsComponentOptions?.type === 'daterange'
})

// 値が入力コンポーネントかどうかをチェック
const isInputComponent = computed(() => {
  if (!currentTokenGroup.value) return false
  const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value?.key.type)
  return typeof tokenDef?.tags === 'string' && tokenDef.tags.startsWith('Input')
})

// 日付の選択処理
const handleDateSelected = (value: Date | Date[] | string | null) => {
  if (!currentTokenGroup.value || !value) return

  let formattedDate: string

  // daterangeタイプの場合、配列を文字列に変換
  if (isDateRangePicker.value && Array.isArray(value)) {
    formattedDate = value.map(date => dayjs(date).format('YYYY-MM-DD')).join(',')
  } else {
    formattedDate = dayjs(value).format('YYYY-MM-DD')
  }

  if (editingTokenIndex.value !== null) {
    // 編集モード
    const token = modelValue.value[editingTokenIndex.value]
    token.value.data = formattedDate

    currentTokenGroup.value.value = formattedDate
    currentTokenGroup.value.editing = null
  } else {
    // 新規作成モード
    const newTokenGroup = { ...currentTokenGroup.value, value: formattedDate }

    modelValue.value.push({
      type: newTokenGroup.key.type,
      value: {
        data: formattedDate,
        operator: newTokenGroup.operator
      }
    })

    resetInputState()
    showInput()
  }
}

// DatePicker用のkeydown.enterイベントハンドラを追加
const handleDatePickerEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && inputValue.value) {
    const isArray = Array.isArray(inputValue.value)
    let values: Date[] = [inputValue.value[0], inputValue.value[1]]
    if (isArray) {
      // From/To の判別
      const inputs = Array.from(event.target.parentElement.querySelectorAll('.el-range-input'));
      const index = inputs.indexOf(event.target);
      const isFromInput = index === 0
      if (isFromInput) {
        values[0] = event.target.value
      } else {
        values[1] = event.target.value
      }
    }
    handleDateSelected(isArray ? values : dayjs(event.target.value).toDate())

    nextTick(() => {
      inputValue.value = ''
    })
  }
}

// 入力状態をリセット
const resetInputState = () => {
  inputValue.value = ''
  inputStep.value = 'key'
  currentTokenGroup.value = null
  editingTokenIndex.value = null
  inputVisibleState.value = false
}

// キー選択時の処理
const handleKeySelected = (item: any) => {
  const tokenDef = item.item

  if (editingTokenIndex.value !== null) {
    // 編集モード
    const tokenGroup = { ...currentTokenGroup.value }
    if (!tokenGroup) return

    tokenGroup.key = {
      type: tokenDef.type,
      title: tokenDef.title
    }

    const token = modelValue.value[editingTokenIndex.value]
    token.type = tokenDef.type

    currentTokenGroup.value = tokenGroup
    currentTokenGroup.value.editing = null
  } else {
    // 新規作成モード
    currentTokenGroup.value = {
      key: {
        type: tokenDef.type,
        title: tokenDef.title
      },
      operator: '',
      value: '',
      editing: null
    }

    inputValue.value = ''

    // operatorsの条件判定
    const hasOperators = tokenDef.operators && tokenDef.operators.length > 0
    const hasSingleOperator = tokenDef.operators && tokenDef.operators.length === 1

    if (hasSingleOperator) {
      // 単一オペレーターの場合は自動選択して値入力に進む
      currentTokenGroup.value.operator = tokenDef.operators[0]
      inputStep.value = 'value'
    } else if (hasOperators) {
      // 複数のオペレーターがある場合は選択ステップへ
      inputStep.value = 'operator'
    } else {
      // オペレーターがない場合は値入力に進む
      inputStep.value = 'value'
    }
  }
  nextTick(() => {
    if (isDatePicker.value && inputStep.value === 'value') {
      if (!inputValue.value) {
        inputValue.value = isDateRangePicker.value ? [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] : dayjs().format('YYYY-MM-DD')
      }
      datePickerRef.value?.focus()
    } else {
      inputRef.value?.focus()
    }
  })
}
const handleKeyEnterPrevnt = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'Enter') {
    inputRef.value.highlightedIndex = -1
    emit('keydown-enter', event)
  }
}
// キー入力のEnterキー処理
const handleKeyEnter = (event: KeyboardEvent) => {
  if (!inputValue.value) return

  if (editingTokenIndex.value !== null) {
    // 編集モード
    const tokenGroup = { ...currentTokenGroup.value }
    if (!tokenGroup) return

    tokenGroup.key = {
      type: 'string',
      title: inputValue.value,
      isCustom: true
    }

    const token = modelValue.value[editingTokenIndex.value]
    token.type = 'string'

    currentTokenGroup.value = tokenGroup
    currentTokenGroup.value.editing = null
  } else {
    // 新規作成モード - 入力値をそのままトークンとして追加
    modelValue.value.push({
      type: 'string',
      value: {
        data: inputValue.value,
        operator: ''
      }
    })

    // 入力状態をリセットして次の入力に備える
    resetInputState()
    showInput()
  }
  if (event.ctrlKey && event.key === 'Enter') {
    inputRef.value.highlightedIndex = -1
    emit('keydown-enter', event)
  }
}

// キー入力のblurイベント処理
const handleKeyBlur = () => {
  isInputRefFocus.value = false
  if (!inputValue.value || inputStep.value !== 'key') return

  // サジェスト選択中の場合は処理をスキップ（サジェスト選択時にもblurが発生するため）
  setTimeout(() => {
    if (!inputVisible.value || props.disabled) return

    if (editingTokenIndex.value !== null) {
      // 編集モード
      const tokenGroup = { ...currentTokenGroup.value }
      if (!tokenGroup) return

      tokenGroup.key = {
        type: 'string',
        title: inputValue.value,
        isCustom: true
      }

      const token = modelValue.value[editingTokenIndex.value]
      token.type = 'string'

      currentTokenGroup.value = tokenGroup
      currentTokenGroup.value.editing = null
    } else {
      // 新規作成モード - 入力値をそのままトークンとして追加
      modelValue.value.push({
        type: 'string',
        value: {
          data: inputValue.value,
          operator: ''
        }
      })

      // 入力状態をリセットして次の入力に備える
      resetInputState()
      showInput()
    }
  }, 200)
}

// オペレーター選択時の処理
const handleOperatorSelected = (item: any) => {
  if (!currentTokenGroup.value) return

  if (editingTokenIndex.value !== null) {
    // 編集モード
    currentTokenGroup.value.operator = item.value
    const token = modelValue.value[editingTokenIndex.value]
    token.value.operator = item.value
    currentTokenGroup.value.editing = null
  } else {
    // 新規作成モード
    currentTokenGroup.value.operator = item.value
    inputValue.value = ''
    inputStep.value = 'value'
  }

  nextTick(() => {
    if (isDatePicker.value) {
      if (!inputValue.value) {
        inputValue.value = dayjs().format('YYYY-MM-DD')
      }
      datePickerRef.value?.focus()
    } else {
      inputRef.value?.focus()
    }
  })
}

// オペレーター入力のEnterキー処理
const handleOperatorEnter = () => {
  if (!inputValue.value || !currentTokenGroup.value) return

  if (editingTokenIndex.value !== null) {
    // 編集モード
    currentTokenGroup.value.operator = inputValue.value
    const token = modelValue.value[editingTokenIndex.value]
    token.value.operator = inputValue.value
    currentTokenGroup.value.editing = null
  } else {
    // 新規作成モード
    currentTokenGroup.value.operator = inputValue.value
    inputValue.value = ''
    inputStep.value = 'value'
  }

  nextTick(() => {
    if (isDatePicker.value) {
      datePickerRef.value?.focus()
    } else {
      inputRef.value?.focus()
    }
  })
}

// 値選択時の処理
const handleValueSelected = (item: any) => {
  if (!currentTokenGroup.value) return

  // オブジェクト型のタグの場合、idを保存
  const saveValue = item.item ? item.item.id : item.value

  if (editingTokenIndex.value !== null) {
    // 編集モード
    currentTokenGroup.value.value = item.value
    const token = modelValue.value[editingTokenIndex.value]
    token.value.data = saveValue
    currentTokenGroup.value.editing = null
  } else {
    // 新規作成モード
    const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value.key.type);
    const hasOperators = tokenDef?.operators && tokenDef.operators.length > 0;
    const hasSingleOperator = tokenDef?.operators && tokenDef.operators.length === 1;

    // オペレーターの決定
    let operator = '';
    if (hasOperators) {
      if (hasSingleOperator) {
        // 単一オペレーターの場合は自動選択
        operator = tokenDef.operators[0];
      } else {
        // 複数オペレーターの場合は選択されたものを使用
        operator = currentTokenGroup.value.operator;
      }
    }

    modelValue.value.push({
      type: currentTokenGroup.value.key.type,
      value: {
        data: saveValue,
        operator: operator
      }
    })

    resetInputState()
    showInput()
  }
}

// 入力確定時の処理
const handleInputConfirm = () => {
  if (!inputValue.value || !currentTokenGroup.value) return

  if (inputStep.value === 'value') {
    if (editingTokenIndex.value !== null) {
      // 編集モード
      currentTokenGroup.value.value = inputValue.value
      const token = modelValue.value[editingTokenIndex.value]
      token.value.data = inputValue.value
      currentTokenGroup.value.editing = null
    } else {
      // 新規作成モード
      const tokenDef = props.availableTokens.find(t => t.type === currentTokenGroup.value.key.type);
      const hasOperators = tokenDef?.operators && tokenDef.operators.length > 0;
      const hasSingleOperator = tokenDef?.operators && tokenDef.operators.length === 1;

      // オペレーターの決定
      let operator = '';
      if (hasOperators) {
        if (hasSingleOperator) {
          // 単一オペレーターの場合は自動選択
          operator = tokenDef.operators[0];
        } else {
          // 複数オペレーターの場合は選択されたものを使用
          operator = currentTokenGroup.value.operator;
        }
      }

      modelValue.value.push({
        type: currentTokenGroup.value.key.type,
        value: {
          data: inputValue.value,
          operator: operator
        }
      })

      resetInputState()
      showInput()
    }
  }
}

// ElTagクリック時に編集モードを開始
const startEditing = (index: number, part: 'key' | 'operator' | 'value') => {
  if (props.disabled) return

  // 編集状態の初期表示フラグをセット
  initialEditMode.value = true

  // クリックされたトークンを取得
  const token = modelValue.value[index];
  const tokenDef = props.availableTokens.find(t => t.type === token.type);

  // オペレーター条件をチェック
  const hasOperators = tokenDef?.operators && tokenDef.operators.length > 0;
  const hasSingleOperator = tokenDef?.operators && tokenDef.operators.length === 1;

  // オペレーターがない場合またはオペレーターが一つだけの場合にオペレーター部分をクリックしたら何もしない
  if (part === 'operator' && (!hasOperators || hasSingleOperator)) {
    return;
  }

  // トークンをモデルから削除
  modelValue.value.splice(index, 1);

  // 取得したトークンを編集状態にする
  if (token.type === 'string') {
    // stringタイプの場合は特別処理
    currentTokenGroup.value = {
      key: {
        type: 'string',
        title: token.value.data as string,
        isCustom: true,
        isStringValue: true // stringタイプを識別するフラグ
      },
      operator: '',
      value: '',
      editing: null
    };

    inputStep.value = 'key';
    inputValue.value = token.value.data.toString();
  } else {
    // 通常のトークン
    currentTokenGroup.value = {
      key: {
        type: token.type,
        title: tokenDef?.title || token.type,
        isCustom: !tokenDef
      },
      operator: token.value.operator,
      value: token.value.data,
      editing: null
    };

    // クリックされた部分に応じて編集ステップを設定
    if (part === 'operator' && hasSingleOperator) {
      // 単一オペレーターの場合はオペレーター編集をスキップして値編集に進む
      inputStep.value = 'value';
    } else {
      inputStep.value = part;
    }

    if (part === 'key') {
      inputValue.value = currentTokenGroup.value.key.title;
    } else if (part === 'operator') {
      inputValue.value = currentTokenGroup.value.operator;
    } else if (part === 'value') {
      // 日付範囲タイプの場合の特別処理
      const isDateRange = tokenDef?.tags === 'DatePicker' && tokenDef?.tagsComponentOptions?.type === 'daterange';

      if (isDateRange && typeof token.value.data === 'string' && token.value.data.includes(',')) {
        // カンマで区切られた日付文字列を配列に変換
        const dateStrings = token.value.data.split(',');
        inputValue.value = dateStrings.map(dateStr => dayjs(dateStr).toDate());
      } else if (tokenDef && Array.isArray(tokenDef.tags)) {
        // オブジェクトタイプのタグの場合、表示名を取得
        const tagObj = tokenDef.tags.find(tag =>
          typeof tag === 'object' && tag !== null && tag.id === token.value.data
        );

        if (tagObj) {
          // 名前を入力フィールドにセット
          inputValue.value = tagObj.name;
        } else {
          // オブジェクトが見つからない場合は通常通り文字列化
          inputValue.value = currentTokenGroup.value.value.toString();
        }
      } else {
        // オブジェクトタイプでない場合は通常通り
        inputValue.value = currentTokenGroup.value.value.toString();
      }
    }
  }

  inputVisibleState.value = true;

  nextTick(() => {
    if (part === 'value' && isDatePicker.value) {
      datePickerRef.value?.focus();
    } else {
      inputRef.value?.focus();
    }
  });
}
// Backspace処理
const handleBackspace = (event: KeyboardEvent) => {
  // ElDatePickerの場合、event.target.valueで入力値を確認する
  const isDatePickerEmpty = isDatePicker.value &&
    (event.target instanceof HTMLInputElement &&
      (event.target.value === '' || (event.target.value.length < 2 && isDateRangePicker.value)))

  if (event.key === 'Backspace' && (inputValue.value === '' || isDatePickerEmpty)) {
    if (editingTokenIndex.value !== null) {
      // 編集モードの場合はキャンセル
      currentTokenGroup.value!.editing = null
      editingTokenIndex.value = null
      resetInputState()
    } else {
      // 新規作成モード
      if (inputStep.value === 'value') {
        // 現在のトークンのタイプに対応するトークン定義を取得
        const tokenDef = currentTokenGroup.value
          ? props.availableTokens.find(t => t.type === currentTokenGroup.value.key.type)
          : null;

        // オペレーターの条件判定
        const hasOperators = tokenDef?.operators && tokenDef.operators.length > 0;
        const hasSingleOperator = tokenDef?.operators && tokenDef.operators.length === 1;

        if (hasOperators && !hasSingleOperator) {
          // 複数のオペレーターがある場合のみオペレーター選択ステップに戻る
          inputStep.value = 'operator';
          inputValue.value = '';
        } else {
          // オペレーターがない場合またはオペレーターが1つだけの場合は直接キー入力に戻る
          inputStep.value = 'key';
          inputValue.value = '';
          currentTokenGroup.value = null;
        }

        nextTick(() => {
          setTimeout(() => {
            inputRef.value?.focus();
          }, 50);
        });
      } else if (inputStep.value === 'operator') {
        inputStep.value = 'key'
        inputValue.value = ''
        currentTokenGroup.value = null
        nextTick(() => {
          setTimeout(() => {
            inputRef.value?.focus()
          }, 50)
        })
      } else if (inputStep.value === 'key' && modelValue.value.length > 0) {
        // key入力中にバックスペースを押した場合、最後のトークングループの値を編集状態にする
        event.preventDefault() // デフォルトのバックスペース動作を防止

        // 最後のトークンのインデックスを取得
        const lastTokenIndex = modelValue.value.length - 1

        // startEditing経由で値の編集モードを開始
        startEditing(lastTokenIndex, 'value')

        // 編集モードのステートがすでにセットされているため、重複処理は不要
      }
    }
  }
}

// 全トークンのクリア
const clearAllTokens = () => {
  if (props.disabled) return
  modelValue.value = []
  inputRef.value?.focus();
}

// コンポーネント初期化時に入力フィールドを表示
watch(
  () => inputVisibleState.value,
  (newVal) => {
    if (newVal && inputStep.value === 'key' && !props.disabled) {
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  }
)

// disabledプロパティの変更を監視
watch(
  () => props.disabled,
  (newVal) => {
    if (newVal) {
      // 無効になった場合は入力フィールドを非表示にする
      inputVisibleState.value = false
    }
  }
)

// カスタム入力のトークン削除処理
const handleCustomTokenClose = (index: number) => {
  if (props.disabled) return
  modelValue.value.splice(index, 1)
}
</script>

<template>
  <div class="el-text-query-input">
    <div class="input-container flex items-center">
      <!-- トークングループ表示 -->
      <template v-for="(tokenGroup, index) in tokenGroups" :key="index">
        <!-- stringタイプの場合は1つのElTagのみ表示 -->
        <template v-if="tokenGroup.key.isStringValue">
          <ElTag
            class="flex items-center gap-1 token-tag"
            :closable="!disabled"
            :disable-transitions="false"
            v-bind="availableTokens.find(t => t.type === tokenGroup.key.type)?.tagOptions || {}"
            @click="startEditing(index, 'key')"
            @close="handleCustomTokenClose(index)"
          >
            {{ tokenGroup.key.title }}
          </ElTag>
        </template>

        <!-- 通常のKey-Operator-Value表示 -->
        <template v-else>
          <div class="token-group flex items-center">
            <!-- キータグ -->
            <ElTag
              :class="['token-key flex items-center gap-1 token-tag', { 'editing': tokenGroup.editing === 'key' }]"
              :closable="tokenGroup.key.isCustom && !disabled"
              :disable-transitions="false"
              v-bind="availableTokens.find(t => t.type === tokenGroup.key.type)?.tagOptions || {}"
              @click="startEditing(index, 'key')"
              @close="handleCustomTokenClose(index)"
            >
              <ElIcon v-if="availableTokens.find(t => t.type === tokenGroup.key.type)?.icon">
                <component :is="ElementPlusIcons[availableTokens.find(t => t.type === tokenGroup.key.type)?.icon]"/>
              </ElIcon>
              {{ tokenGroup.key.title }}
            </ElTag>

            <!-- オペレータータグ (常に表示) -->
            <ElTag
              :class="['token-operator flex items-center gap-1 token-tag', { 'editing': tokenGroup.editing === 'operator' }]"
              @click="startEditing(index, 'operator')"
            >
              {{ tokenGroup.operator }}
            </ElTag>

            <!-- 値タグ（削除ボタン付き） -->
            <ElTag
              :class="['token-value flex items-center gap-1 token-tag', { 'editing': tokenGroup.editing === 'value' }]"
              :closable="!disabled"
              :disable-transitions="false"
              @click="startEditing(index, 'value')"
              @close="handleTokenGroupClose(index)"
            >
              <ElIcon v-if="tokenGroup.valueIcon">
                <component :is="ElementPlusIcons[tokenGroup.valueIcon]"/>
              </ElIcon>
              {{ tokenGroup.displayValue }}
            </ElTag>
          </div>
        </template>
      </template>

      <!-- 入力中のトークングループを表示 -->
      <template
        v-if="currentTokenGroup && !editingTokenIndex && !props.disabled && !currentTokenGroup.key.isStringValue">
        <div class="token-group flex items-center">
          <!-- キータグ -->
          <ElTag
            :class="['token-key flex items-center gap-1', { 'active': inputStep === 'key' }]"
            v-bind="availableTokens.find(t => t.type === currentTokenGroup.key.type)?.tagOptions || {}"
          >
            <ElIcon v-if="availableTokens.find(t => t.type === currentTokenGroup.key.type)?.icon">
              <component
                :is="ElementPlusIcons[availableTokens.find(t => t.type === currentTokenGroup.key.type)?.icon]"/>
            </ElIcon>
            {{ currentTokenGroup.key.title }}
          </ElTag>

          <!-- オペレータータグ (inputStepが'value'の場合に表示) -->
          <ElTag
            v-if="inputStep === 'value'"
            :class="['token-operator flex items-center gap-1', { 'active': inputStep === 'value' }]"
          >
            {{ currentTokenGroup.operator || '...' }}
          </ElTag>
        </div>
      </template>

      <!-- 入力フィールド部分 -->
      <!-- 編集モード: キー入力 -->
      <ElAutocomplete
        v-if="inputVisible && inputStep === 'key' && (editingTokenIndex !== null ? currentTokenGroup?.editing === 'key' : true)"
        ref="inputRef"
        v-model="inputValue"
        :fetch-suggestions="getKeySuggestions"
        :placeholder="getCurrentPlaceholder"
        class="input-field"
        size="small"
        clearable
        @select="handleKeySelected"
        @keydown="handleBackspace"
        @keydown.enter.prevent="handleKeyEnterPrevnt"
        @keyup.enter="handleKeyEnter"
        @blur="handleKeyBlur"
        @input="handleInputChange"
        @focus="handleInputFocus"
        :highlight-first-item="true"
        title="Search(Ctrl+Enter)"
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <ElIcon class="mr-1" v-if="item.item?.icon">
              <component :is="ElementPlusIcons[item.item.icon]"/>
            </ElIcon>
            <span>{{ item.value }}</span>
          </div>
        </template>
      </ElAutocomplete>

      <!-- 編集モード: オペレーター入力 (operators が複数定義されている場合のみ表示) -->
      <ElAutocomplete
        v-else-if="inputVisible && inputStep === 'operator' &&
                  (editingTokenIndex !== null ? currentTokenGroup?.editing === 'operator' : true) &&
                  currentTokenGroup &&
                  availableTokens.find(t => t.type === currentTokenGroup.key.type)?.operators &&
                  availableTokens.find(t => t.type === currentTokenGroup.key.type)?.operators.length > 1"
        ref="inputRef"
        v-model="inputValue"
        :fetch-suggestions="getOperatorSuggestions"
        :placeholder="getCurrentPlaceholder"
        class="input-field"
        size="small"
        clearable
        @select="handleOperatorSelected"
        @keydown="handleBackspace"
        @keydown.enter.prevent
        @keyup.enter="handleOperatorEnter"
        @blur="handleOperatorEnter"
        @input="handleInputChange"
        :highlight-first-item="true"
      />

      <!-- 編集モード: 値入力（日付） -->
      <ElDatePicker
        v-else-if="inputVisible && inputStep === 'value' && isDatePicker"
        ref="datePickerRef"
        v-model="inputValue"
        :placeholder="getCurrentPlaceholder"
        class="input-field"
        size="small"
        clearable
        @change="handleDateSelected"
        @keydown="handleBackspace"
        @keydown.enter="handleDatePickerEnter"
        v-bind="datePickerOptions"
      />

      <!-- 編集モード: 値入力（数値） -->
      <ElInput
        v-else-if="inputVisible && inputStep === 'value' && isInputComponent"
        ref="inputRef"
        v-model="inputValue"
        type="number"
        :placeholder="getCurrentPlaceholder"
        class="input-field"
        size="small"
        clearable
        @keydown="handleBackspace"
        @keydown.enter.prevent
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
        v-bind="inputNumberOptions"
      />

      <!-- 編集モード: 値入力（通常） -->
      <ElAutocomplete
        v-else-if="inputVisible && inputStep === 'value'"
        ref="inputRef"
        v-model="inputValue"
        :fetch-suggestions="getValueSuggestions"
        :placeholder="getCurrentPlaceholder"
        class="input-field"
        size="small"
        clearable
        @select="handleValueSelected"
        @keydown="handleBackspace"
        @keydown.enter.prevent
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
        @input="handleInputChange"
        :highlight-first-item="true"
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <ElIcon class="mr-1" v-if="item.item?.icon">
              <component :is="ElementPlusIcons[item.item.icon]"/>
            </ElIcon>
            <span>{{ item.value }}</span>
          </div>
        </template>
      </ElAutocomplete>
    </div>

    <!-- 全クリアボタン -->
    <ElButton
      v-if="!disabled && modelValue.length > 0 && !currentTokenGroup?.editing"
      class="clear-button"
      size="large"
      @click="clearAllTokens"
    >
      ⓧ
    </ElButton>
  </div>
  <slot name="append"/>
</template>

<style scoped>
.el-text-query-input {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-blank);
  transition: var(--el-transition-box-shadow);
  padding: 1px 8px 1px 11px;
  box-sizing: border-box;
  position: relative;
  overflow-x: auto; /* 横スクロールを許可 */
}

.el-text-query-input:hover {
  border-color: var(--el-border-color-hover);
}

.el-text-query-input:focus-within {
  border-color: var(--el-color-primary);
  outline: 0;
  box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.2);
}

.input-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap; /* 折り返しを防止 */
  align-items: center;
  flex: 1;
  min-width: 0;
  position: relative;
  padding: 5px 0;
  gap: 5px;
  overflow-x: visible; /* 横方向のオーバーフローを許可 */
}

.token-tag {
  height: 24px;
  line-height: 22px;
  margin: 2px 0;
  flex-shrink: 0; /* タグのサイズを固定 */
}

/* タグ内のテキスト部分にホバー効果と手型カーソルを適用 */
.token-tag :deep(.el-tag__content) {
  cursor: pointer;
}

.token-tag :deep(.el-tag__content):hover {
  color: var(--el-color-primary);
}

.token-group {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1px;
  margin-right: 4px;
  flex-shrink: 0; /* グループのサイズを固定 */
}

.token-key {
  border-radius: 4px 0 0 4px;
}

.token-operator {
  border-radius: 0;
}

.token-value {
  border-radius: 0 4px 4px 0;
}

.input-field {
  margin: 0;
  width: auto;
  min-width: 60px;
  max-width: 200px; /* 入力フィールドの最大幅を制限 */
  flex-shrink: 1; /* 入力フィールドは縮小可能 */
}

.input-field :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none !important;
  padding: 0;
}

.input-field :deep(.el-input__inner) {
  height: 24px;
  line-height: 24px;
}

.clear-button {
  border: none;
  background: transparent;
  color: var(--el-text-color-secondary);
  margin-left: 5px;
  padding: 2px 5px;
  height: 24px;
  line-height: 20px;
  flex-shrink: 0; /* ボタンのサイズを固定 */
}

.clear-button:hover {
  color: var(--el-color-danger);
}

.token-tag.active {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
}
</style>
