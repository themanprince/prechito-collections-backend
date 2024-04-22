class Mutex {
	constructor() {
		this.queue = Promise.resolve();
	}
	
	lock() {
		let release;
		
		const currentLock = new Promise(resolve => {
			release = resolve;
		});
		
		this.queue = this.queue.then(() => currentLock);
		
		return () => {
			release();
		}
	}
}

//testing out
const mutex = new Mutex();

async function test1() {
	console.log(`in test1, before locking mutex`);
	const release = await mutex.lock();
	console.log(`test1 just obtained mutex lock`);
	await new Promise(resolve => setTimeout(resolve, 2000));
	console.log(`just finished running test1 long shi... releasing mutex`);
	release();
}

async function test2() {
	console.log(`in test2, before locking mutex`);
	const release = await mutex.lock();
	console.log(`test2 just obtained mutex lock`);
	await new Promise(resolve => setTimeout(resolve, 2000));
	console.log(`just finished running test2 long shi... releasing mutex`);
	release();
}

test1();
test2();