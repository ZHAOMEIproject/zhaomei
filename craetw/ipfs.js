const { getFilesFromPath,Web3Storage } = require('web3.storage');

storeFiles("/root/learn/github/zhaomei/craetw/go/creat")

async function storeFiles(path) {
    const files = await getFilesFromPath(path);
    const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFFQ0QwMGYxQUYwMWUyMzEzNDZENTQzNjg4MmYyZTNlODVjOEUzN2UiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc2OTkxMTA1MjksIm5hbWUiOiJ0ZXN0In0.gBcymUuKBrHW80sYdGpQZuTCP2JiwxJeHaheS_fUJ2M" });
    const rootCid = await client.put(files);
    console.log(rootCid);
}