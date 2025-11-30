require('dotenv').config();
const { createRichMenu, setDefaultRichMenu, listRichMenus, deleteRichMenu } = require('./src/services/richMenu');

const main = async () => {
    console.log('🚀 Hanna Rich Menu Setup\n');

    try {
        // List existing rich menus
        console.log('📋 Checking existing rich menus...');
        const existing = await listRichMenus();
        console.log(`Found ${existing.length} existing rich menus\n`);

        // Delete old menus (optional - comment out if you want to keep them)
        if (existing.length > 0) {
            console.log('🗑️  Deleting old rich menus...');
            for (const menu of existing) {
                await deleteRichMenu(menu.richMenuId);
            }
            console.log('');
        }

        // Create new rich menu
        console.log('🎨 Creating new rich menu...');
        const richMenuId = await createRichMenu();
        console.log(`Rich Menu ID: ${richMenuId}\n`);

        // Set as default
        console.log('⚙️  Setting as default rich menu...');
        await setDefaultRichMenu(richMenuId);

        console.log('\n✅ Rich Menu setup complete!');
        console.log('\n📝 Next step: Upload the rich menu image');
        console.log('   You can design the image at: https://www.figma.com');
        console.log('   Required size: 2500 x 1686 pixels');
        console.log('   Then upload via LINE Developers Console\n');
        console.log(`   Rich Menu ID: ${richMenuId}`);

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
};

main();
