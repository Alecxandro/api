const modelPermissions = {
    users: {
        canCRUD: {
            admin: ['principal', 'instructor', 'student'],
            principal: ['instructor', 'student'],
            instructor: ['student'],
            student: ['student'],
        },
        classes: {
            canCRUD: {
                admin: ['principal', 'instructor', 'student'],
                principal: ['instructor', 'student'],
                instructor: ['student'],
                student: [],
            },
        },
        grades: {
            canCRUD: {
                admin: ['principal', 'instructor', 'student'],
                principal: ['instructor', 'student'],
                instructor: ['student'],
                student: [],
            },
        }
    },
}

export default modelPermissions;