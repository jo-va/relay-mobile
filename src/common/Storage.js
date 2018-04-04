import Realm from 'realm';

// This is a key/value wrapper around Realm because AsyncStorage
// had serious issues while debugging
// see https://github.com/facebook/react-native/issues/12830

// Downgraded Ream from 2.3.3 to 2.2.8 to solve 'Subscription is not defined' issue
// see https://github.com/realm/realm-js/issues/1711

// Using the single instance pattern
// see https://k94n.com/es6-modules-single-instance-pattern

const KeyValueItem = {
	name: 'KeyValueItem',
	primaryKey: 'key',
	schemaVersion: 1,
	properties: {
		key: { type: 'string' },
		value: { type: 'string' }
	}
};

class Storage {
	constructor() {
		this.realm = new Realm({
			schema: [KeyValueItem],
			schemaVersion: 1
		});
	}

	get(key) {
		const result = this.realm.objects('KeyValueItem').filtered(`key = "${key}"`);
		return result && result[0] ? result[0].value : null;
	}
	
	set(key, value) {
		try {
			this.realm.write(() => {
				this.realm.create('KeyValueItem', { key, value }, true);
			});
		} catch (err) {
			console.log('Storage.set error: ', err);
		}
	}
	
	remove(key) {
		try {
			this.realm.write(() => {
				const object = this.realm.objects('KeyValueItem').filtered(`key = "${key}"`);
				this.realm.delete(object);
			});
		} catch (err) {
			console.log('Storage.remove error: ', err);
		}
	}
}

export let storage = new Storage();
