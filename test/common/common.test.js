import test from 'ava';
import {
  handleParamsValue
} from '../../common/utils.js';


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
    t.is(handleParamsValue('aaa   {{ aaaa | upper }} bbbb'), 'aaa   AAAA bbbb')
    t.is(handleParamsValue('aaa   {{ aaaa | upper }} bbbb,aaa   {{ aaaa | upper }} bbbb'), 'aaa   AAAA bbbb,aaa   AAAA bbbb')
    t.is(handleParamsValue("{{aaaa | length}}"), 4);
    t.is(handleParamsValue("{{4444 | number}}"), 4444);
});

