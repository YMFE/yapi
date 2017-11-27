import test from 'ava';
import {
  handleParamsValue
} from '../../client/common.js';


test('handleParamsValue', t => {
    const json = JSON.stringify({
      t: 1,
      obj: {
        name: "dd",
        value: "vvvv"
      }
    })


    t.is(handleParamsValue(" aaaa | length"), 'aaaa | length');
    t.is(handleParamsValue("{{aaaa |upper }}"), 'AAAA')
    t.is(handleParamsValue(json), json)
    t.is(handleParamsValue('   {{ dkkdjf }}'), 'dkkdjf')
    t.is(handleParamsValue('   {{ dkkdjf | upper | kkk }}'), '{{ dkkdjf | upper | kkk }}')
});

